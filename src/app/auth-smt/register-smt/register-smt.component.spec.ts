import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSmtComponent } from './register-smt.component';

describe('RegisterSmtComponent', () => {
  let component: RegisterSmtComponent;
  let fixture: ComponentFixture<RegisterSmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterSmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
