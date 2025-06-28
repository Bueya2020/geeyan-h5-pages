-- 数据库迁移脚本
-- 版本: v1.0
-- 创建时间: 2025-01-16
-- 说明: 此脚本包含数据库表结构修改和RBAC实现的SQL语句

-- 开启事务
START TRANSACTION;

-- 1. 修改现有表的字段类型
-- 1.1 修改users表
ALTER TABLE users
    MODIFY COLUMN id VARCHAR(36) DEFAULT (UUID()),
    MODIFY COLUMN email VARCHAR(255),
    MODIFY COLUMN name VARCHAR(100),
    MODIFY COLUMN avatar VARCHAR(500),
    ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN last_login_at TIMESTAMP NULL;

-- 1.2 修改customer_profiles表
ALTER TABLE customer_profiles
    MODIFY COLUMN id VARCHAR(36) DEFAULT (UUID()),
    MODIFY COLUMN user_id VARCHAR(36);

-- 1.3 修改design_projects表
ALTER TABLE design_projects
    MODIFY COLUMN id VARCHAR(36) DEFAULT (UUID()),
    MODIFY COLUMN customer_id VARCHAR(36),
    MODIFY COLUMN designer_id VARCHAR(36);

-- 2. 创建缺失的devices表
CREATE TABLE devices (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    type ENUM('gateway', 'sensor', 'switch', 'camera', 'lock', 'light', 'curtain', 'speaker') NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    description TEXT,
    specifications JSON,
    images JSON,
    category_id VARCHAR(36),
    stock_quantity INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_type (type),
    INDEX idx_brand (brand),
    INDEX idx_category (category_id),
    INDEX idx_status (status)
);

-- 3. 创建RBAC相关表
-- 3.1 角色表
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3.2 权限表
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.3 角色权限关联表
CREATE TABLE role_permissions (
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 3.4 用户角色关联表
CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. 插入基础角色数据
INSERT INTO roles (name, description, is_system) VALUES
('administrator', '系统管理员，拥有最高权限', true),
('designer', '设计师，负责智能设计方案', true),
('constructor', '施工人员，负责施工项目管理', true),
('customer', '普通用户/客户', true);

-- 5. 插入基础权限数据
INSERT INTO permissions (code, name, module, description) VALUES
-- 用户管理模块
('user:list', '查看用户列表', 'user', '查看系统用户列表'),
('user:create', '创建用户', 'user', '创建新用户'),
('user:update', '更新用户', 'user', '更新用户信息'),
('user:delete', '删除用户', 'user', '删除用户'),

-- 设计模块
('design:create', '创建设计', 'design', '创建新的设计方案'),
('design:update', '更新设计', 'design', '更新设计方案'),
('design:view', '查看设计', 'design', '查看设计方案'),
('design:delete', '删除设计', 'design', '删除设计方案'),
('design:ai_generate', 'AI生成设计', 'design', '使用AI生成设计方案'),

-- 施工模块
('construction:create', '创建施工项目', 'construction', '创建新的施工项目'),
('construction:update', '更新施工项目', 'construction', '更新施工项目信息'),
('construction:view', '查看施工项目', 'construction', '查看施工项目'),
('construction:delete', '删除施工项目', 'construction', '删除施工项目'),
('construction:progress', '更新施工进度', 'construction', '更新施工项目进度'),

-- 商品模块
('product:create', '创建商品', 'product', '创建新商品'),
('product:update', '更新商品', 'product', '更新商品信息'),
('product:view', '查看商品', 'product', '查看商品信息'),
('product:delete', '删除商品', 'product', '删除商品'),
('product:inventory', '管理库存', 'product', '管理商品库存'),

-- 订单模块
('order:create', '创建订单', 'order', '创建新订单'),
('order:update', '更新订单', 'order', '更新订单信息'),
('order:view', '查看订单', 'order', '查看订单信息'),
('order:cancel', '取消订单', 'order', '取消订单'),
('order:refund', '订单退款', 'order', '处理订单退款');

-- 6. 创建权限检查函数
DELIMITER //

CREATE FUNCTION check_user_permission(
    p_user_id VARCHAR(36),
    p_permission_code VARCHAR(100)
) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE has_permission BOOLEAN;
    
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = p_user_id
        AND p.code = p_permission_code
    ) INTO has_permission;
    
    RETURN has_permission;
END //

DELIMITER ;

-- 7. 创建复合索引
CREATE INDEX idx_orders_user_status_time ON orders(user_id, status, created_at);
CREATE INDEX idx_products_category_status_price ON products(category_id, status, price);
CREATE INDEX idx_projects_user_status_progress ON projects(user_id, status, progress_percentage);
CREATE INDEX idx_designs_user_room_style ON designs(user_id, room_type, style);

-- 提交事务
COMMIT;

-- 回滚语句（如果需要回滚）
-- ROLLBACK;

-- 修复商品表字段名称 (与前端H5页面保持一致)
ALTER TABLE products 
    CHANGE COLUMN price base_price DECIMAL(10,2) COMMENT '当前价格 (与前端H5页面一致)',
    ADD COLUMN specs JSON COMMENT '商品规格 (与前端H5页面一致)' AFTER base_price;

-- 更新索引
DROP INDEX IF EXISTS idx_price ON products;
CREATE INDEX idx_base_price ON products(base_price);

-- 确保用户表包含phone字段 (与前端H5页面保持一致)
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE COMMENT '手机号 (与前端H5页面一致)' AFTER email,
    ADD COLUMN IF NOT EXISTS username VARCHAR(50) COMMENT '用户名 (与前端H5页面一致)' AFTER phone;

-- 添加phone字段索引
CREATE INDEX IF NOT EXISTS idx_phone ON users(phone);
