
import { createComment, getProfile, queryPostComments } from 'applet-apis';

export interface Comment {
  id: number;
  content: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
}

export interface Reply {
  id: number;
  text: string;
  author: {
    name: string;
  };
  createdAt: string;
}

class CommentPlugin {
  postId: number;
  container: HTMLElement;

  constructor(postId: number, container: HTMLElement) {
    this.postId = postId;
    this.container = container;
  }

  init(): void {
    const commentForm: HTMLFormElement = document.createElement('form');
    const commentInput: HTMLTextAreaElement = document.createElement('textarea');
    const commentButton: HTMLButtonElement = document.createElement('button');
    const commentList: HTMLUListElement = document.createElement('ul');

    commentForm.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      const commentText: string = commentInput.value;
      this.createComment(commentText);
    });

    commentButton.innerText = 'Add Comment';
    commentForm.appendChild(commentInput);
    commentForm.appendChild(commentButton);

    this.fetchComments().then((comments: Comment[]) => {
      this.renderComments(comments, commentList);
    });

    this.container.appendChild(commentForm);
    this.container.appendChild(commentList);
  }

  async fetchComments(): Promise<Comment[]> {
    const comments = await queryPostComments({ page: 1, pageSize: 10, postId: this.postId, commentId: null })

    await getProfile()
    return comments.data;
  }

  async createComment(commentText: string): Promise<void> {
      const newComment = await createComment({
        postId: this.postId,
      content: commentText,
        contentFormat: 'SIMPLE',
    })
    this.renderComment(newComment);
  }

  renderComments(comments: Comment[], commentList: HTMLUListElement): void {
    console.log(comments)
    comments.forEach((comment: Comment) => {
      const commentItem: HTMLLIElement = this.createCommentItem(comment);
      commentList.appendChild(commentItem);
    });
  }

  renderComment(comment: Comment): void {
    const commentList: HTMLUListElement | null = this.container.querySelector('ul');
    if (commentList !== null) {
      const commentItem: HTMLLIElement = this.createCommentItem(comment);
      commentList.appendChild(commentItem);
      commentList.appendChild(commentItem);
    }
  }

  createCommentItem(comment: Comment): HTMLLIElement {
    const commentItem: HTMLLIElement = document.createElement('li');
    const commentText: HTMLParagraphElement = document.createElement('p');
    const authorName: HTMLSpanElement = document.createElement('span');
    const authorTime: HTMLSpanElement = document.createElement('span');
    const replyButton: HTMLButtonElement = document.createElement('button');
    const replyForm: HTMLFormElement = document.createElement('form');
    const replyInput: HTMLTextAreaElement = document.createElement('textarea');
    const replyButton2: HTMLButtonElement = document.createElement('button');
    const replyList: HTMLUListElement = document.createElement('ul');

    commentText.innerText = comment.content;
    authorName.innerText = comment.author.name;
    authorTime.innerText = new Date(comment.createdAt).toLocaleString();
    replyButton.innerText = 'Reply';

    replyForm.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      const replyText: string = replyInput.value;
      this.createReply(comment.id, replyText, replyList);
    });

    replyButton2.innerText = 'Add Reply';
    replyForm.appendChild(replyInput);
    replyForm.appendChild(replyButton2);
    commentItem.appendChild(commentText);
    commentItem.appendChild(authorName);
    commentItem.appendChild(authorTime);
    commentItem.appendChild(replyButton);
    commentItem.appendChild(replyForm);
    commentItem.appendChild(replyList);

    return commentItem;
  }

  async createReply(commentId: number, replyText: string, replyList: HTMLUListElement): Promise<void> {
    const newReplyComment = await createComment({
      postId: this.postId,
      repliedCommentId: commentId,
      content: replyText,
      contentFormat: 'SIMPLE',
    })
    this.renderReply(newReplyComment, replyList);
  }

  renderReply(reply: Reply, replyList: HTMLUListElement): void {
    const replyItem: HTMLLIElement = this.createReplyItem(reply);
    replyList.appendChild(replyItem);
  }

  createReplyItem(reply: Reply): HTMLLIElement {
    const replyItem: HTMLLIElement = document.createElement('li');
    const replyText: HTMLParagraphElement = document.createElement('p');
    const authorName: HTMLSpanElement = document.createElement('span');
    const authorTime: HTMLSpanElement = document.createElement('span');
    authorName.innerText = reply.author.name;
    authorTime.innerText = new Date(reply.createdAt).toLocaleString();

    replyText.innerText = reply.text;
    replyItem.appendChild(replyText);
    replyItem.appendChild(authorName);
    replyItem.appendChild(authorTime);

    return replyItem;
  }
}

export default CommentPlugin;
