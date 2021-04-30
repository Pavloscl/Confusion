import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //dish: Dish;  //version tutorial
  //dish = new Dish; // este objeto nunca estara vacio
  dish!: Dish;
  dishErrMess: string = "";
  promotion!:Promotion;
  promoErrMess: string = "";
  leader!: Leader;
  leaderErrMess: string = "";
  
  

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,
   @Inject('baseURL') public baseURL : any
 ) { }

  ngOnInit(): void {
    this.dishservice.getFeaturedDish()
        .subscribe(dish=> this.dish= dish,
          errmess => this.dishErrMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
        .subscribe(promotion=> this.promotion= promotion,
          errmess => this.promoErrMess = <any>errmess);
     this.leaderservice.getFeaturedLeader()
         .subscribe(leader=> this.leader= leader,
          errmess => this.leaderErrMess = <any>errmess);
    
  }

}
