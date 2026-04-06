import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    countryCode!: string;

    @IsString()
    @IsNotEmpty()
    state!: string;

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    district!: string;

    @IsString()
    @IsNotEmpty()
    street!: string;

    @IsString()
    number?: string;

    @IsString()
    complement?: string;

    @IsString()
    @IsNotEmpty()
    postalCode!: string;
}