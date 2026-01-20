import { z } from 'zod';

// Profile form validation schema
export const profileSchema = z.object({
    username: z.string().min(2, '用户名至少2个字符').max(50, '用户名最多50个字符').optional(),
    full_name: z.string().max(100, '姓名最多100个字符').optional(),
    phone: z.string().max(20, '电话号码最多20个字符').optional(),
    address: z.string().max(500, '地址最多500个字符').optional(),
    city: z.string().max(50, '城市最多50个字符').optional(),
    province: z.string().max(50, '省份最多50个字符').optional(),
    bio: z.string().max(500, '简介最多500个字符').optional(),
});

// Pet publish form validation schema
export const petSchema = z.object({
    name: z.string().min(1, '请输入宠物名字').max(100, '名字最多100个字符'),
    species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other'] as const, {
        message: '请选择宠物种类',
    }),
    breed: z.string().max(100, '品种最多100个字符').optional(),
    age_years: z.number().min(0, '年龄不能为负数').max(50, '年龄不能超过50岁').optional(),
    age_months: z.number().min(0, '月龄不能为负数').max(11, '月龄不能超过11个月').optional(),
    gender: z.enum(['male', 'female', 'unknown'] as const).optional(),
    size: z.enum(['small', 'medium', 'large'] as const).optional(),
    color: z.string().max(50, '颜色最多50个字符').optional(),
    description: z.string().max(2000, '描述最多2000个字符').optional(),
    health_status: z.string().max(500, '健康状况最多500个字符').optional(),
    vaccination_status: z.string().max(50, '疫苗状态最多50个字符').optional(),
    sterilized: z.boolean().optional(),
    location_city: z.string().max(50, '城市最多50个字符').optional(),
    location_province: z.string().max(50, '省份最多50个字符').optional(),
    adoption_requirements: z.string().max(1000, '领养要求最多1000个字符').optional(),
});

// Adoption application form validation schema
export const applicationSchema = z.object({
    applicant_name: z.string().min(1, '请输入您的姓名').max(100, '姓名最多100个字符'),
    applicant_phone: z.string().min(1, '请输入您的电话').max(20, '电话最多20个字符'),
    applicant_address: z.string().min(1, '请输入您的地址').max(500, '地址最多500个字符'),
    applicant_city: z.string().max(50, '城市最多50个字符').optional(),
    applicant_province: z.string().max(50, '省份最多50个字符').optional(),
    living_situation: z.string().max(500, '居住情况最多500个字符').optional(),
    has_experience: z.boolean().optional(),
    experience_details: z.string().max(500, '养宠经验详情最多500个字符').optional(),
    has_other_pets: z.boolean().optional(),
    other_pets_details: z.string().max(500, '其他宠物详情最多500个字符').optional(),
    reason: z.string().min(1, '请输入领养理由').max(1000, '领养理由最多1000个字符'),
    additional_info: z.string().max(500, '补充信息最多500个字符').optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type PetFormData = z.infer<typeof petSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;

