import { BrowserModule } from '@angular/platform-browser';

// Routing
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule } from '@angular/core';

// FormsModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

// Components
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { BooklistComponent } from './booklist/booklist.component';
import { updateEntryDialog } from './booklist/booklist.component';
import { deleteEntryVerificationDialog } from './booklist/booklist.component';
import { FriendsComponent } from './friends/friends.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    HomeComponent,
    BooklistComponent,
    updateEntryDialog,
    deleteEntryVerificationDialog,
    FriendsComponent,
    TimelineComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
