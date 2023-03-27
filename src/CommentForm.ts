import { createComment } from 'applet-apis'
import { type Comment } from './index'

interface Props {
  postId: number
  onCommentCreated: (comment: Comment) => void
}

async function handleCreateComment (postId: number, commentText: string): Promise<Comment> {
  const newComment = await createComment({
    postId,
    content: commentText,
    contentFormat: 'SIMPLE'
  })
  return newComment
}

export default function CommentForm (props: Props): HTMLElement {
  const commentForm = document.createElement('form')
  const commentInput = document.createElement('textarea')
  const commentButton = document.createElement('button')

  Object.assign(commentForm.style, {
    backgroundColor: '#222',
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0'
  })
  Object.assign(commentInput.style, {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '5px',
    width: '100%',
    padding: '10px',
    resize: 'none',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box'
  })
  Object.assign(commentButton.style, {
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    marginLeft: '10px'
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const commentText = commentInput.value
    const res = await handleCreateComment(props.postId, commentText)
    props.onCommentCreated(res)
    commentInput.value = ''
  })

  commentButton.innerText = 'Comment'
  commentForm.appendChild(commentInput)
  commentForm.appendChild(commentButton)

  return commentForm
}
