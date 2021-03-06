import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Post } from '../models';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../util';
import { first } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser:any;
  allUsers = [];
  private socket: WebSocket;
  public peopleFollow = new Subject<any>();
  public followers = new Subject<any>();
  public followings = new Subject<any>();

  public postSubject = new Subject<any>();
  public searchSubject = new BehaviorSubject<Array<Post>>([]);
  public adminBadPostSubject = new Subject<any>();

  // public notificationSubject = new BehaviorSubject<any>();
  

  constructor(private http: HttpClient, private authService: AuthenticationService, private tostService: ToastrService) { 
    // this.connect();
    console.log("V12")
  }

  public connect() {
      this.socket = new WebSocket(environment.API_SOCKET_URL);
      this.socket.onopen = (event) => {
          this.socket.send(JSON.stringify({token: this.authService.getCurrentUser().access_token}));
      }

      this.socket.onmessage = (event) => {
        this.postSubject.next();
        this.adminBadPostSubject.next();
        console.log(event.data, 'FROM SERVER');

        try{
             let d = JSON.parse(event.data);
             this.tostService.success(d['message']);
        }catch(err) {}
       
        console.log("NOTIFICATIPN MESSAGE: " + event.data);
      }

  }
  

  getUserById(id) {
    return this.http.get<ApiResponse>(environment.API_URL + "/api/users/1/" + id);
  }

  signup(user: User){
     return this.http.post<ApiResponse>(environment.API_URL + "/api/auth/signup", user);
  }

  setCurrentUser(user:User) {
    this.currentUser = user;
    let c = JSON.parse(localStorage.getItem('currentUser'));
    if(user) {
      user.access_token = c.access_token;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
    }
    
  }
  getCurrrentUser() {
    return this.currentUser;
  }

  createPost(post: Post) {
      return this.http.post<ApiResponse>(environment.API_URL + "/api/user/create-post", post);
  }
  _getAllUsers() {
    return this.http.get<ApiResponse>(environment.API_URL + "/api/users");
  }

  getAllUsers() {
    return this.allUsers;
  }

  follow(id) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/follow/"+ id, {});
  }

  unFollow(id) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/unfollow/"+ id, {});
  }
  fetchFeed(page?: number) {
    let u ="/api/user/feetch-feeds"
    if(page) {
      u = u + "?page="+ page;
    }
    return this.http.get<ApiResponse>(environment.API_URL + u);
  }

  addComment(postId, data) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/add-comment/" + postId, {text: data});
  }

  likePost(postId) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/like-post/" + postId, {});
  }

  unLikePost(postId) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/unlike-post/" + postId, {});
  }
  
  getPosts() {
    return this.http.get<ApiResponse>(environment.API_URL + "/api/user/posts");
  }
  feetchAds() {
    return this.http.get<ApiResponse>(environment.API_URL + "/api/user/fetch-ads");
  }

  getFollowers() {
    return this.http.get<ApiResponse>(environment.API_URL + "/api/user/followers");
  }

  getFollwings() {
    return this.http.get<ApiResponse>(environment.API_URL + "/api/user/followings");
  }

  changeProfilePic(pic) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/change-pic", {pic: pic});
  }
  searchPosts(searchThis){
    return this.http.post<ApiResponse>(environment.API_URL+"/api/user/search-posts", {search: searchThis})
  }

  updateUser(data) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/update-user", data);
  }

  searchFeeds(search) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/search-feeds", {search: search});
  }

  deleteComment(data) {
    return this.http.post<ApiResponse>(environment.API_URL + "/api/user/delete-comment", data);
  }

  
  getPost(postId) {
    return this.http.get<ApiResponse>(environment.API_URL + "/api/user/get-post/"+postId);
  }

  
  
}

