import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrawlersComponent } from './scrawlers.component';

describe('ScrawlersComponent', () => {
  let component: ScrawlersComponent;
  let fixture: ComponentFixture<ScrawlersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrawlersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrawlersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
