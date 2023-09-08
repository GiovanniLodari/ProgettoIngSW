import { TestBed } from '@angular/core/testing';
import { LoginServiceService } from './login-service.service';
import { HttpClient } from '@angular/common/http';
constructor(private http: HttpClient) { }

describe('LoginServiceService', () => {
  let service: LoginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
