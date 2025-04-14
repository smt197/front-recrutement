import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTwofaComponent } from './setup-twofa.component';

describe('SetupTwofaComponent', () => {
  let component: SetupTwofaComponent;
  let fixture: ComponentFixture<SetupTwofaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupTwofaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupTwofaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
