import { errorContext } from 'rxjs/internal/util/errorContext';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/UserService';
import { User } from '../../models/User';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  email!:string;
  password!:string;
  firstName!:string;
  lastName!:string;
constructor(
  private service:UserService,
){}

  login(){
    // console.log('here in login');
    // console.log(this.email);
    // console.log(this.password);
    if(this.email==null||this.password==null||this.firstName==null||this.lastName==null){
      return;
    }
// make request here 

// const l=this.loginmapper.makeLongin(this.email,this.password);
const l:User={
  firstName: this.firstName,
  password: this.password,
  email: this.email,
  lastName: this.lastName,
  id: 0,
  addresses: []
};
console.log("we make login ");
this.service.login(l).subscribe({
      next:(res)=>{
        console.log('Success!', res);
        localStorage.setItem("token", res); 
        this.email = '';
        this.password = '';
        this.lastName='';
        this.firstName='';
        alert('Login successful!');
      },
      error:(err)=>{
        console.log('Error:', err);
        // console.log(err);
        if(err.status === 409){
          alert('Password or email not correct');
        } else {
          alert('Login failed');
        }
      }
    });

  }

}

