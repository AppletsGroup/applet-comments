import { type Comment } from './index'
import { createComment } from 'applet-apis'

async function handleCreateReply (postId: number, commentId: number, replyText: string): Promise<Comment> {
  const newReplyComment = await createComment({
    postId,
    repliedCommentId: commentId,
    content: replyText,
    contentFormat: 'SIMPLE'
  })
  return newReplyComment
}

function createReplyItemElement (reply: Comment): HTMLLIElement {
  const replyItem: HTMLLIElement = document.createElement('li')
  const replyText: HTMLParagraphElement = document.createElement('p')
  const authorName: HTMLSpanElement = document.createElement('span')
  const authorTime: HTMLSpanElement = document.createElement('span')
  authorName.innerText = reply.author.name
  authorTime.innerText = new Date(reply.createdAt).toLocaleString()

  replyText.innerText = reply.content
  replyItem.appendChild(replyText)
  replyItem.appendChild(authorName)
  replyItem.appendChild(authorTime)

  return replyItem
}

export default function CommentItem (postId: number, comment: Comment): HTMLLIElement {
  const commentItem = document.createElement('li')
  const commentText = document.createElement('p')
  const authorName = document.createElement('span')
  const authorTime = document.createElement('span')
  const replyButton = document.createElement('button')
  const replyForm = document.createElement('form')
  const replyInput = document.createElement('textarea')
  const addCommentButton = document.createElement('button')
  const replyList = document.createElement('ul')

  commentText.innerText = comment.content
  authorName.innerText = comment.author.name
  authorTime.innerText = new Date(comment.createdAt).toLocaleString()
  replyButton.innerText = 'Reply'

  replyButton.addEventListener('click', () => {
    replyForm.style.display = 'flex'
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  replyForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const replyText = replyInput.value
    const newReplyComment = await handleCreateReply(postId, comment.id, replyText)
    const newReplyCommentElement = createReplyItemElement(newReplyComment)
    replyList.appendChild(newReplyCommentElement)
    replyForm.style.display = 'none'
  })

  addCommentButton.innerText = 'Add Reply'
  replyForm.style.display = 'none' // hide the reply form by default
  replyForm.appendChild(replyInput)
  replyForm.appendChild(addCommentButton)
  commentItem.appendChild(commentText)
  commentItem.appendChild(authorName)
  commentItem.appendChild(authorTime)
  commentItem.appendChild(replyButton)
  commentItem.appendChild(replyForm)

  // recursively render sub-comments
  if (comment.comments?.data.length > 0) {
    const subCommentList = document.createElement('ul')
    comment.comments.data.forEach((subComment) => {
      const subCommentItem = CommentItem(postId, subComment)
      subCommentList.appendChild(subCommentItem)
    })
    commentItem.appendChild(subCommentList)
  }

  commentItem.appendChild(replyList)

  // Set dark theme styles using Object.assign()
  Object.assign(commentItem.style, {
    backgroundColor: '#444',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px'
  })
  Object.assign(commentText.style, {
    color: '#fff',
    marginBottom: '5px'
  })
  Object.assign(authorName.style, {
    color: '#ccc',
    marginRight: '10px'
  })
  Object.assign(authorTime.style, {
    color: '#ccc'
  })
  Object.assign(replyButton.style, {
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    marginRight: '10px'
  })
  Object.assign(replyForm.style, {
    marginBottom: '10px',
    alignItems: 'end'
  })
  Object.assign(replyInput.style, {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '5px'
  })
  Object.assign(addCommentButton.style, {
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px'
  })
  Object.assign(replyList.style, {
    listStyleType: 'none',
    paddingLeft: '20px',
    marginTop: '10px'
  })

  return commentItem
}
