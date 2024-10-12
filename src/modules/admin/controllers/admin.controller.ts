import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
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

  @Delete('listings/:id')
  async deleteListing(@Param('id') id: number) {
    await this.adminService.deleteListing(id);
  }

  @Patch('categories/:id')
  async manageCategory(@Param('id') id: number, @Body() updatedCategoryData) {
    return await this.adminService.manageCategory(id, updatedCategoryData);
  }
}
