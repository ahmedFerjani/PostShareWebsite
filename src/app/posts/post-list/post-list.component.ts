import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  posts: Post[] = [];
  length = 0; //page number
  pageSize = 3; //how many article in page
  total = 0;
  pageSizeOptions = [5, 10, 15];
  currentPage = 1;
  userId:any ;
  private postsSub: Subscription;
  private showSpinner = false;
  private userStatusListenerSub;
  isAuth: boolean;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.showSpinner = true;
    this.postsService.getPosts(1, this.pageSize);
    this.userId = this.authService.getUserId() ;
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postsCount: number }) => {
        this.showSpinner = false;
        this.length = postData.postsCount;
        this.posts = postData.posts;
      });

    this.isAuth = this.authService.getIsAuth();
    this.userStatusListenerSub = this.authService
      .getStatusListener()
      .subscribe(res => {
        this.isAuth = res;
        this.userId = this.authService.getUserId() ;
      });
  }

  pageEvent(event: PageEvent) {
    this.showSpinner = true;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.postsService.getPosts(this.currentPage, this.pageSize);
    this.showSpinner = false;
  }

  onDelete(postId: string) {
    this.showSpinner = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.currentPage, this.pageSize);
    });
    this.showSpinner = false;
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.userStatusListenerSub.unsubscribe();
  }
}
