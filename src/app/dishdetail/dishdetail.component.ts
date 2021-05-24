import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { Key } from 'selenium-webdriver';
import { Feedback, ContactType } from '../shared/feedback';
import { isNull, TYPED_NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],

  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {
  
  dish!: Dish | null;
  dishIds: string[]=[];
  prev: string="";
  next: string="";
  errMess: string = "";
  commentForm!: FormGroup;
  comment: Comment = new Comment;
  feedback!: Feedback;
  contactType = ContactType;
  dishcopy: Dish= new Dish() ;
  visibility = 'shown';
  
  @ViewChild('fform') commentFormDirective:any;

   //formErrors = {   //Segun documentacion del curso  --- error TS7053----- Solucion  : { [key: string]: any } 
   formErrors : { [key: string]: any } ={
    'author': '',
    'rating': '',
    'comment': ''
    
  };

 // validationMessages = { //Segun documentacion del curso  --- error TS7053----- Solucion  : { [key: string]: any } 
   validationMessages : {[Key:string]:any}  = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    },
    'rating': {
      'required':      'Rating is required.',
      'minlength':     'Rating must be at least 2 characters long.',
      'maxlength':     'Rating cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 10 characters long.',
      'maxlength':     'Comment  cannot be more than 50 characters long.'
    },
    
  };
  
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('baseURL') public baseURL:any 
  ) 
  {
    this.createForm();
   }
 

    ngOnInit() {
      this.dishservice.getDishIds()
        .subscribe(dishIds => this.dishIds = dishIds);
      this.route.params
        .pipe(switchMap((params: Params) => {this.visibility='hidden'; return this.dishservice.getDish(params['id']);}))
        .subscribe(dish => { this.dish = dish;this.dishcopy= dish, this.setPrevNext(dish.id);this.visibility = 'shown';  },
         errmess => this.errMess = <any>errmess);
    }


    createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(25)] ],
        rating: '',
        comment: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(25)] ]
      });
      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
       
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
        this.formErrors[field]  = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
           const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
  
    goBack(): void {
      this.location.back();
    }
    onSubmit() {
      this.comment = this.commentForm.value;
      this.comment.date=new Date().toISOString();
      console.log(this.comment);
      this.dishcopy.comments.push(this.comment);
      this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      //errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; }); // Error ts 2322 tipo null
      errmess => { this.dish= null;this.errMess = <any>errmess; });
      this.commentFormDirective.resetForm();
      this.commentForm.reset({
        author: '',
        rating: '',
        comment: '',
        
      });
      this.commentFormDirective.resetForm();
    }
    
    

}
