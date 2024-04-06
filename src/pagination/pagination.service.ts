import { Injectable } from '@nestjs/common';
import { PaginationDto } from './pagination.dto';

@Injectable()
export class PaginationService {
    getPagination(dto:PaginationDto, defaultPerPage = 30){
        const page = dto.page ? +dto.page : 1
        const perPage = dto.perPage ? +dto.perPage : defaultPerPage
        
        const skip = (page - 1) * perPage
        //сколько элементов нужно скипнуть чтобы вывести конктретную часть элементов
        return {perPage, skip}
    }
}
