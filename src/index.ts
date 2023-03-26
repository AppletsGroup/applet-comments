
import { createComment, getProfile, queryPostComments } from 'applet-apis'

export interface Comment {
  id: number
  content: string
  author: {
    name: string
    avatarUrl: string
  }
  comments: {
    data: Comment[]
    hasNext: boolean
  }
  createdAt: string
}

class CommentPlugin {
  postId: number
  container: HTMLElement

  constructor (postId: number, container: HTMLElement) {
    this.postId = postId
    this.container = container
  }

  init (): void {
    const commentForm = document.createElement('form')
    const commentInput = document.createElement('textarea')
    const commentButton = document.createElement('button')
    const commentList = document.createElement('ul')

    // Set dark theme styles using Object.assign()
    Object.assign(commentForm.style, {
      backgroundColor: '#222',
      padding: '20px',
      borderRadius: '10px',
      display: 'flex'
    })
    Object.assign(commentInput.style, {
      backgroundColor: '#333',
      color: '#fff',
      borderRadius: '5px'
    })
    Object.assign(commentButton.style, {
      backgroundColor: '#555',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      marginTop: '10px'
    })
    Object.assign(commentList.style, {
      listStyleType: 'none',
      padding: '0'
    })

    commentForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const commentText = commentInput.value
      void this.createComment(commentText)
    })

    commentButton.innerText = 'Add Comment'
    commentForm.appendChild(commentInput)
    commentForm.appendChild(commentButton)

    void this.fetchComments().then((comments) => {
      this.renderComments(comments, commentList)
    })

    // Set container styles using Object.assign()
    Object.assign(this.container.style, {
      padding: '2px',
      borderRadius: '10px'
    })

    this.container.appendChild(commentForm)
    this.container.appendChild(commentList)
  }

  destory (): void {
    while (this.container.firstChild != null) {
      this.container.removeChild(this.container.firstChild)
    }
  }

  async fetchComments (): Promise<Comment[]> {
    const comments = await queryPostComments({ page: 1, pageSize: 10, postId: this.postId, commentId: null })

    await getProfile()
    return comments.data
  }

  async createComment (commentText: string): Promise<void> {
    const newComment = await createComment({
      postId: this.postId,
      content: commentText,
      contentFormat: 'SIMPLE'
    })
    this.renderComment(newComment)
  }

  renderComments (comments: Comment[], commentList: HTMLUListElement): void {
    comments.forEach((comment: Comment) => {
      const commentItem: HTMLLIElement = this.createCommentItem(comment)
      commentList.appendChild(commentItem)
    })
  }

  renderComment (comment: Comment): void {
    const commentList: HTMLUListElement | null = this.container.querySelector('ul')
    if (commentList !== null) {
      const commentItem: HTMLLIElement = this.createCommentItem(comment)
      commentList.appendChild(commentItem)
      commentList.appendChild(commentItem)
    }
  }

  createCommentItem (comment: Comment): HTMLLIElement {
    const commentItem = document.createElement('li')
    const commentText = document.createElement('p')
    const authorName = document.createElement('span')
    const authorTime = document.createElement('span')
    const replyButton = document.createElement('button')
    const replyForm = document.createElement('form')
    const replyInput = document.createElement('textarea')
    const replyButton2 = document.createElement('button')
    const replyList = document.createElement('ul')

    commentText.innerText = comment.content
    authorName.innerText = comment.author.name
    authorTime.innerText = new Date(comment.createdAt).toLocaleString()
    replyButton.innerText = 'Reply'

    replyButton.addEventListener('click', () => {
      replyForm.style.display = 'flex'
    })

    replyForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const replyText = replyInput.value
      void this.createReply(comment.id, replyText, replyList)
      replyForm.style.display = 'none'
    })

    replyButton2.innerText = 'Add Reply'
    replyForm.style.display = 'none' // hide the reply form by default
    replyForm.appendChild(replyInput)
    replyForm.appendChild(replyButton2)
    commentItem.appendChild(commentText)
    commentItem.appendChild(authorName)
    commentItem.appendChild(authorTime)
    commentItem.appendChild(replyButton)
    commentItem.appendChild(replyForm)

    // recursively render sub-comments
    if (comment.comments.data.length > 0) {
      const subCommentList = document.createElement('ul')
      comment.comments.data.forEach((subComment) => {
        const subCommentItem = this.createCommentItem(subComment)
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
    Object.assign(replyButton2.style, {
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

  async createReply (commentId: number, replyText: string, replyList: HTMLUListElement): Promise<void> {
    const newReplyComment = await createComment({
      postId: this.postId,
      repliedCommentId: commentId,
      content: replyText,
      contentFormat: 'SIMPLE'
    })
    this.renderReply(newReplyComment, replyList)
  }

  renderReply (reply: Comment, replyList: HTMLUListElement): void {
    const replyItem: HTMLLIElement = this.createReplyItem(reply)
    replyList.appendChild(replyItem)
  }

  createReplyItem (reply: Comment): HTMLLIElement {
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
}

export default CommentPlugin
