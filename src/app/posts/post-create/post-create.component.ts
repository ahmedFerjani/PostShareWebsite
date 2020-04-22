import { Component, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  title = "";
  content = "";
  form: FormGroup;
  imgSrc: string;
  public post: Post;
  private mode = "create";
  private postId: string;
  private showSpinner = false;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.showSpinner = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.showSpinner = false;
          this.post = {
            id: postData.id,
            title: postData.title,
            content: postData.content,
            imagesrc: postData.imagesrc,
            userId: null
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagesrc
          });
        });
      } else {
        this.mode = "create";
      }
    });
  }

  imageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    //console.log(file) ;
    //console.log(this.form)

    //image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imgSrc = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.showSpinner = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );

      this.form.reset();
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
      this.form.reset();
    }
    //const post:Post={title: form.value.title, content:form.value.content} ;
  }
}
