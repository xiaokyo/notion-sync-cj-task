require('dotenv').config()
const readFrontendExcelTasks = require('./read-frontend-excel-tasks')

const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const mineTasks = readFrontendExcelTasks()

async function updateCJTask({ page_id, jiraUrl, startDate, endDate }) {
  const res = await notion.pages.update({
    page_id,
    properties: {
      JIRA: {
        url: jiraUrl
      },
      Deadline: {
        date: {
          start: startDate,
          end: endDate
        }
      }
    }
  })
  if (res.id) {
    console.log(`updateCJTask ${page_id} success`)
  } else {
    console.error(`updateCJTask ${page_id} failed`)
  }
}

async function createCJTask({
  title,
  jiraUrl,
  startDate,
  endDate
}) {
  const findRes = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Name',
      title: {
        contains: title,
      },
    }
  })
  const list = findRes.results
  console.log('%cindex.js:51 list.length', 'color: #007acc;', list);
  if (list.length >= 0) {
    await updateCJTask({
      page_id: list[0].id,
      jiraUrl,
      startDate,
      endDate
    })
    return
  }

  const res = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID
    },
    properties: {
      Name: {
        title: [
          {
            type: 'text',
            text: {
              content: title
            }
          }
        ],
        type: "title"
      },
      JIRA: {
        url: jiraUrl
      },
      Deadline: {
        date: {
          start: startDate,
          end: endDate
        }
      }
    }
  })

  if (res?.id) {
    console.log(`createCJTask ${title} success`)
  } else {
    console.error(`createCJTask ${title} failed`)
  }
}

for (const task of mineTasks) {
  createCJTask({
    title: task.title,
    jiraUrl: task.jiraUrl,
    startDate: task.startDate,
    endDate: task.endDate
  })
}