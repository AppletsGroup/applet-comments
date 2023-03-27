import CommentItem from './CommentItem'
import { type Comment } from './index'

interface CommentListProps {
  postId: number
  comments: Comment[]
}

function CommentList ({ postId, comments }: CommentListProps): HTMLElement {
  const commentList = document.createElement('ul')
  Object.assign(commentList.style, {
    listStyleType: 'none',
    padding: '0'
  })

  comments.forEach((comment) => {
    const commentItem: HTMLLIElement = CommentItem(postId, comment)
    commentList.appendChild(commentItem)
  })

  return commentList
}

export default CommentList
