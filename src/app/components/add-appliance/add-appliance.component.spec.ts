import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplianceComponent } from './add-appliance.component';

describe('AddApplianceComponent', () => {
  let component: AddApplianceComponent;
  let fixture: ComponentFixture<AddApplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddApplianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
