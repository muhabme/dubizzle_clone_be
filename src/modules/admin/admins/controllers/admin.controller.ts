import { Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from '../services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async findAllUsers() {
    return await this.adminService.findAllUsers();
  }

  @Patch('users/:id/block')
  async blockUser(@Param('id') id: number) {
    return await this.adminService.blockUser(id);
  }
}
