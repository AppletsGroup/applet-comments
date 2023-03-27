import { queryPostComments } from 'applet-apis'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import CommentItem from './CommentItem'

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

class AppletComments {
  postId: number
  container: HTMLElement
  commentsContainer: HTMLElement
  observer: IntersectionObserver
  commentsPage: number

  constructor (postId: number, container: HTMLElement) {
    this.commentsPage = 1
    this.postId = postId
    this.container = container

    const commentForm = CommentForm({ postId: this.postId, onCommentCreated: this.onCommentCreated.bind(this) })
    this.container.appendChild(commentForm)

    this.commentsContainer = document.createElement('div')
    this.commentsContainer.style.paddingBottom = '80px'
    this.container.appendChild(this.commentsContainer)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.observer = new IntersectionObserver(this.loadMoreComments.bind(this))
  }

  async init (): Promise<void> {
    const comments = await this.fetchComments()
    const commentList = CommentList({ postId: this.postId, comments })
    this.commentsContainer.appendChild(commentList)

    const sentry = document.createElement('div')
    sentry.style.height = '20px'
    sentry.textContent = 'Loading...'
    this.commentsContainer.appendChild(sentry)
    this.observer.observe(sentry)
  }

  destory (): void {
    while (this.container.firstChild != null) {
      this.container.removeChild(this.container.firstChild)
    }
  }

  onCommentCreated (comment: Comment): void {
    this.renderNewCreatedComment(comment)
  }

  async fetchComments (): Promise<Comment[]> {
    const comments = await queryPostComments({ page: this.commentsPage, pageSize: 10, postId: this.postId, commentId: null })
    return comments.data
  }

  renderNewCreatedComment (comment: Comment): void {
    const commentList: HTMLUListElement | null = this.commentsContainer.querySelector('ul')
    if (commentList !== null) {
      const commentItem: HTMLLIElement = CommentItem(this.postId, comment)
      commentList.appendChild(commentItem)
    }
  }

  async loadMoreComments (entries: IntersectionObserverEntry[]): Promise<void> {
    const entry = entries[0]
    if (entry.isIntersecting) {
      const commentList: HTMLUListElement | null = this.commentsContainer.querySelector('ul')
      if (commentList !== null) {
        this.commentsPage = this.commentsPage + 1
        const newComments = await this.fetchComments()
        if (newComments.length > 0) {
          newComments.forEach((comment: Comment) => {
            const commentItem: HTMLLIElement = CommentItem(this.postId, comment)
            commentList.appendChild(commentItem)
          })
        } else {
          this.observer.unobserve(entry.target)
          this.commentsContainer.removeChild(entry.target)
          const loadedAll = document.createElement('div')
          loadedAll.textContent = 'Loaded all'
          this.commentsContainer.appendChild(loadedAll)
        }
      }
    }
  }
}

export default AppletComments
