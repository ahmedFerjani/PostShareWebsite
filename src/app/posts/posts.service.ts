import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(length, pageSize) {
    //return [...this.posts] ;
    const queryParams = `?length=${length}&pageSize=${pageSize}`;
    this.http
      .get<{ message: string; posts: Post[]; count: number }>(
        "http://127.0.0.1:3000/posts" + queryParams
      )
      /*.pipe(map((postData) =>{
      return postData.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        id: post._id
      };
    });
    }))*/
      .subscribe(fetchedPosts => {
        console.log(fetchedPosts);
        this.posts = fetchedPosts.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: fetchedPosts.count
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    /*console.log(
      "posts  : :  " + JSON.stringify(this.posts.find(p => p.id == id))
    );
    return { ...this.posts.find(p => p.id == id) };*/
    return this.http.get<{
      id: string;
      title: string;
      content: string;
      imagesrc: string;
      userId: string;
    }>("http://127.0.0.1:3000/posts/" + id);
  }

  //Send JSON Post
  /*
  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };

    this.http
      .post<{ message: string; postId: string }>(
        "http://127.0.0.1:3000/posts",
        post
      )
      .subscribe(responseData => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }*/

  //because we use images, we don't use JSON to send our data instead
  //we should combine our text data with files

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    console.log("before subs");

    this.http
      .post<{ message: string; post: Post }>(
        "http://127.0.0.1:3000/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id: id, title: title, content: content, imagesrc:null };
    let postData: Post | FormData;

    //use form data because we pass object (image)
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagesrc: image,
        userId: null
      };
    }

    this.http
      .put("http://127.0.0.1:3000/posts/" + id, postData)

      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://127.0.0.1:3000/posts/" + postId);
  }
}
