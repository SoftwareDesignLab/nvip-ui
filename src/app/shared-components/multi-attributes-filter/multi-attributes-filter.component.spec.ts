import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAttributesFilterComponent } from './multi-attributes-filter.component';

describe('MultiAttributesFilterComponent', () => {
  let component: MultiAttributesFilterComponent;
  let fixture: ComponentFixture<MultiAttributesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiAttributesFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiAttributesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
