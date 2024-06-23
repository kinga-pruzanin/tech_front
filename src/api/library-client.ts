import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { BookDto } from './dto/book.dto';
import { LoanDto } from './dto/loan.dto';
import { UserDto } from './dto/user.dto';

export type ClientResponse<T> = {
  success: boolean;
  data: T;
  statusCode: number;
};

export class LibraryClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8080',
    });
  }

  public async login(
    data: LoginDto,
  ): Promise<ClientResponse<LoginResponseDto | null>> {
    try {
      const response: AxiosResponse<LoginResponseDto> = await this.client.post(
        '/login',
        data,
      );

      this.client.defaults.headers.common['Authorization'] =
        `Bearer ${response.data}`;

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getAllBooks(): Promise<ClientResponse<BookDto | null>> {
    try {
      const response = await this.client.get('/book/getAll');

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getAllLoans(): Promise<ClientResponse<LoanDto | null>> {
    try {
      const response = await this.client.get('/loan/getAll');

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getRole() {
    try {
      const response = await this.client.get('/user/me/role');

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getId() {
    try {
      const response = await this.client.get('/user/me/id');

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteBook(
    isbn: string,
  ): Promise<{ data: null; success: boolean; statusCode: number }> {
    try {
      const response = await this.client.delete(`/book/delete/${isbn}`);

      return {
        success: true,
        data: null,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async updateBook(
    isbn: string,
    updatedBookData: Partial<BookDto>,
  ): Promise<ClientResponse<BookDto | null>> {
    try {
      const response = await this.client.put(
        `/book/update/${isbn}`,
        updatedBookData,
      );

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addBook(book: BookDto): Promise<ClientResponse<BookDto | null>> {
    try {
      const response = await this.client.post('/book/add', book);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async acceptLoan(id: number): Promise<ClientResponse<LoanDto | null>> {
    try {
      const response = await this.client.put(`/loan/accept/${id}`);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addLoan(loan: LoanDto): Promise<ClientResponse<LoanDto | null>> {
    try {
      const response = await this.client.post('/loan/add', loan);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addUser(user: UserDto): Promise<ClientResponse<UserDto | null>> {
    try {
      const response = await this.client.post('/user/add', user);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }
}
