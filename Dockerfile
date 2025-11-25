# Dockerfile
# استخدام صورة PHP رسمية مع Apache
FROM php:8.2-apache

# تثبيت ملحقات PHP الضرورية لـ Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd opcache pdo_pgsql zip

# تثبيت Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# تعيين دليل العمل
WORKDIR /var/www/html

# نسخ ملفات المشروع
COPY . .

# إعداد ملف .env
RUN cp .env.example .env

# إعداد صلاحيات المجلدات
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# تشغيل أوامر البناء
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# إعداد Apache
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# تعريض المنفذ
EXPOSE 80

# أمر البدء
CMD ["apache2-foreground"]
