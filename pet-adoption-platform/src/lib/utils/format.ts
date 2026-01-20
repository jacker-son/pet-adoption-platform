// Format date to Chinese locale
export function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Format date with time
export function formatDateTime(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Format relative time
export function formatRelativeTime(dateString: string | Date): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
}

// Format pet age
export function formatPetAge(years?: number | null, months?: number | null): string {
    if (!years && !months) return '年龄未知';

    const parts: string[] = [];
    if (years && years > 0) parts.push(`${years}岁`);
    if (months && months > 0) parts.push(`${months}个月`);

    return parts.join('') || '年龄未知';
}

// Get species label
export function getSpeciesLabel(species: string): string {
    const labels: Record<string, string> = {
        dog: '狗',
        cat: '猫',
        bird: '鸟',
        rabbit: '兔子',
        other: '其他',
    };
    return labels[species] || species;
}

// Get gender label
export function getGenderLabel(gender?: string | null): string {
    if (!gender) return '未知';
    const labels: Record<string, string> = {
        male: '公',
        female: '母',
        unknown: '未知',
    };
    return labels[gender] || gender;
}

// Get size label
export function getSizeLabel(size?: string | null): string {
    if (!size) return '未知';
    const labels: Record<string, string> = {
        small: '小型',
        medium: '中型',
        large: '大型',
    };
    return labels[size] || size;
}

// Get status label
export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        available: '可领养',
        pending: '待审核',
        adopted: '已领养',
        removed: '已下架',
    };
    return labels[status] || status;
}

// Get application status label
export function getApplicationStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
    };
    return labels[status] || status;
}

// Get status color class
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        available: 'text-green-600 bg-green-100',
        pending: 'text-yellow-600 bg-yellow-100',
        adopted: 'text-blue-600 bg-blue-100',
        removed: 'text-gray-600 bg-gray-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
}

// Get application status color
export function getApplicationStatusColor(status: string): string {
    const colors: Record<string, string> = {
        pending: 'text-yellow-600 bg-yellow-100',
        approved: 'text-green-600 bg-green-100',
        rejected: 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
}

// Format location
export function formatLocation(province?: string | null, city?: string | null): string {
    if (!province && !city) return '未知';
    if (province === city) return province || '未知';
    return [province, city].filter(Boolean).join(' ');
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
