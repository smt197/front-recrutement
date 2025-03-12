import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSmtComponent } from './auth-smt.component';

describe('AuthSmtComponent', () => {
  let component: AuthSmtComponent;
  let fixture: ComponentFixture<AuthSmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthSmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
