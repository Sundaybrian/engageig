import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseitemComponent } from './caseitem.component';

describe('CaseitemComponent', () => {
  let component: CaseitemComponent;
  let fixture: ComponentFixture<CaseitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
