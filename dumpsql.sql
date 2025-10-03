-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: erp_project
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `apiapp_cart`
--

LOCK TABLES `apiapp_cart` WRITE;
/*!40000 ALTER TABLE `apiapp_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiapp_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_cartitem`
--

LOCK TABLES `apiapp_cartitem` WRITE;
/*!40000 ALTER TABLE `apiapp_cartitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiapp_cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_category`
--

LOCK TABLES `apiapp_category` WRITE;
/*!40000 ALTER TABLE `apiapp_category` DISABLE KEYS */;
INSERT IGNORE `apiapp_category` VALUES (1,'Oils & Extracts','oils-extracts','category_img/Oil_Extracts.svg'),(2,'Kitchenware','kitchenware','category_img/Kitchenware.svg'),(3,'Snacks','snacks','category_img/Snacks.svg'),(4,'Personal Care','personal-care','category_img/Personal_Care.svg');
/*!40000 ALTER TABLE `apiapp_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_customeraddress`
--

LOCK TABLES `apiapp_customeraddress` WRITE;
/*!40000 ALTER TABLE `apiapp_customeraddress` DISABLE KEYS */;
INSERT IGNORE `apiapp_customeraddress` VALUES (1,'Default Street','Default State','Default City','12345689',2);
/*!40000 ALTER TABLE `apiapp_customeraddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_customuser`
--

LOCK TABLES `apiapp_customuser` WRITE;
/*!40000 ALTER TABLE `apiapp_customuser` DISABLE KEYS */;
INSERT IGNORE `apiapp_customuser` VALUES (1,'pbkdf2_sha256$870000$PRq9r3fYl9b5YjW4Fj2oex$BJ/1wmpiwWL3/49EHxP8l5XoPIhGBN28C3+BrSS8mQE=',NULL,1,'admin',1,'2025-10-03 15:14:58.262627','admin@gmail.com',NULL,1,1,'2025-10-03 15:14:58.280584'),(2,'pbkdf2_sha256$870000$FgOeeuqdcPOSl2fWfPB3qD$n53GbOxDxOrguAf4swS38b0ZEkKRZZbQVU9Bnvjh8Sc=',NULL,0,'Default User',1,'2025-10-03 15:15:15.901454','user@gmail.com',NULL,NULL,0,'2025-10-03 15:15:15.901472');
/*!40000 ALTER TABLE `apiapp_customuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_customuser_groups`
--

LOCK TABLES `apiapp_customuser_groups` WRITE;
/*!40000 ALTER TABLE `apiapp_customuser_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiapp_customuser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_customuser_user_permissions`
--

LOCK TABLES `apiapp_customuser_user_permissions` WRITE;
/*!40000 ALTER TABLE `apiapp_customuser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiapp_customuser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_delivery`
--

LOCK TABLES `apiapp_delivery` WRITE;
/*!40000 ALTER TABLE `apiapp_delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiapp_delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_order`
--

LOCK TABLES `apiapp_order` WRITE;
/*!40000 ALTER TABLE `apiapp_order` DISABLE KEYS */;
INSERT IGNORE `apiapp_order` VALUES (1,'ORDER_1_TEST',314.00,'VND','user@gmail.com','Pending from Inventory','2025-10-03 15:15:16.795463','Default City','12345689','Default State','Default Street',2),(2,'ORDER_2_TEST',414.00,'VND','user@gmail.com','Pending from Inventory','2025-10-03 15:15:16.812465','Default City','12345689','Default State','Default Street',2),(3,'ORDER_3_TEST',789.00,'VND','user@gmail.com','Paid','2025-10-03 15:15:16.823879','Default City','12345689','Default State','Default Street',2),(4,'ORDER_4_TEST',705.00,'VND','user@gmail.com','Pending from Inventory','2025-10-03 15:15:16.837580','Default City','12345689','Default State','Default Street',2),(5,'ORDER_5_TEST',596.00,'VND','user@gmail.com','Pending from Inventory','2025-10-03 15:15:16.847394','Default City','12345689','Default State','Default Street',2);
/*!40000 ALTER TABLE `apiapp_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_orderitem`
--

LOCK TABLES `apiapp_orderitem` WRITE;
/*!40000 ALTER TABLE `apiapp_orderitem` DISABLE KEYS */;
INSERT IGNORE `apiapp_orderitem` VALUES (1,3,1,1),(2,3,1,8),(3,3,1,1),(4,5,2,18),(5,1,2,8),(6,5,3,8),(7,1,3,1),(8,3,3,20),(9,4,4,4),(10,2,4,4),(11,3,5,15);
/*!40000 ALTER TABLE `apiapp_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_permission`
--

LOCK TABLES `apiapp_permission` WRITE;
/*!40000 ALTER TABLE `apiapp_permission` DISABLE KEYS */;
INSERT IGNORE `apiapp_permission` VALUES (1,'orders.view',''),(2,'orders.edit',''),(3,'orders.assign',''),(4,'orders.update_status',''),(5,'products.create',''),(6,'products.update',''),(7,'products.delete',''),(8,'products.view',''),(9,'products.manage',''),(10,'customers.view',''),(11,'inventory.manage',''),(12,'tickets.create',''),(13,'tickets.update',''),(14,'tickets.close',''),(15,'delivery.view',''),(16,'delivery.manage',''),(17,'returns.process',''),(18,'reports.view',''),(19,'reports.sales',''),(20,'reports.finance',''),(21,'payments.view',''),(22,'payments.verify',''),(23,'payments.refund',''),(24,'users.manage',''),(25,'rbac.manage',''),(26,'dashboard.view',''),(27,'chat.access','');
/*!40000 ALTER TABLE `apiapp_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_product`
--

LOCK TABLES `apiapp_product` WRITE;
/*!40000 ALTER TABLE `apiapp_product` DISABLE KEYS */;
INSERT IGNORE `apiapp_product` VALUES (1,'Cold-Pressed Coconut Oil','Pure cold-pressed coconut oil, retaining maximum nutrients and natural flavor. Ideal for cooking, baking, and skincare.',8.00,'cold-pressed-coconut-oil','product_img/cold_pressed_coconut_oil.jpg',1,1,0),(2,'Virgin Coconut Oil','Fresh virgin coconut oil with a delicate aroma, perfect for smoothies, salads, and daily beauty routines.',9.00,'virgin-coconut-oil','product_img/virgin_coconut_oil.jpg',1,1,0),(3,'Refined Coconut Oil','Clean and mild refined coconut oil, versatile for high-heat cooking, frying, and baking.',7.50,'refined-coconut-oil','product_img/refined_coconut_oil.png',1,1,0),(4,'Coconut Butter','Smooth coconut butter, rich in flavor and healthy fats. Spread on toast or use in desserts.',6.00,'coconut-butter','product_img/coconut_butter.jpg',1,1,0),(5,'Coconut Extract','Concentrated coconut extract for baking and flavoring. Adds a natural tropical taste to your recipes.',5.50,'coconut-extract','product_img/coconut_extract.jpg',1,1,0),(6,'Coconut Bowl','Eco-friendly handmade coconut bowl, perfect for smoothie bowls, salads, and snacks.',5.00,'coconut-bowl','product_img/coconut_bowl.jpg',1,2,0),(7,'Coconut Cups','Sustainable coconut shell cups, ideal for juices, cocktails, or rustic table settings.',4.50,'coconut-cups','product_img/coconut_cups.jpg',1,2,0),(8,'Coconut Cutlery','Reusable coconut wood cutlery set, lightweight and biodegradable for eco-conscious dining.',3.00,'coconut-cutlery','product_img/coconut_cutlery.jpg',1,2,0),(9,'Coconut Serving Trays','Handcrafted coconut serving trays, stylish and durable for snacks, drinks, or décor.',6.50,'coconut-serving-trays','product_img/coconut_serving_trays.jpg',1,2,0),(10,'Coconut Candle Holders','Rustic coconut shell candle holders, adding a warm, natural touch to any space.',4.00,'coconut-candle-holders','product_img/coconut_candle_holders.jpg',1,2,0),(11,'Coconut Chips','Crispy roasted coconut chips, lightly sweetened for a healthy and delicious snack.',3.50,'coconut-chips','product_img/coconut_chips.jpg',1,3,0),(12,'Toasted Coconut Chips','Golden toasted coconut chips with a crunchy texture and rich flavor. Great for snacking or toppings.',3.80,'toasted-coconut-chips','product_img/toasted_coconut_chips.jpg',1,3,0),(13,'Coconut Candy','Sweet and chewy coconut candy made with natural ingredients. A tropical treat for all ages.',2.50,'coconut-candy','product_img/coconut_candy.jpg',1,3,0),(14,'Coconut Cookies','Crispy coconut cookies baked with real coconut flakes for a delightful crunch.',4.20,'coconut-cookies','product_img/coconut_cookies.jpg',1,3,0),(15,'Coconut Granola','Nutritious granola with crunchy oats and coconut, perfect for breakfast or as a snack.',5.00,'coconut-granola','product_img/coconut_granola.jpg',1,3,0),(16,'Coconut Soap','Moisturizing coconut soap with natural oils, gentle on the skin and refreshing.',4.00,'coconut-soap','product_img/coconut_soap.jpg',1,4,0),(17,'Coconut Shampoo','Nourishing coconut shampoo that strengthens hair, leaving it soft and shiny.',6.00,'coconut-shampoo','product_img/coconut_shampoo.jpg',1,4,0),(18,'Coconut Body Lotion','Hydrating coconut body lotion that smooths and softens skin with a tropical scent.',7.00,'coconut-body-lotion','product_img/coconut_body_lotion.jpg',1,4,0),(19,'Coconut Lip Balm','Natural coconut lip balm that nourishes and protects lips from dryness.',2.00,'coconut-lip-balm','product_img/coconut_lip_balm.jpg',1,4,0),(20,'Coconut Face Scrub','Exfoliating coconut face scrub that gently removes dead skin cells for a fresh glow.',5.50,'coconut-face-scrub','product_img/coconut_face_scrub.jpg',1,4,0);
/*!40000 ALTER TABLE `apiapp_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_role`
--

LOCK TABLES `apiapp_role` WRITE;
/*!40000 ALTER TABLE `apiapp_role` DISABLE KEYS */;
INSERT IGNORE `apiapp_role` VALUES (1,'admin',''),(2,'staff_inventory',''),(3,'staff_support',''),(4,'staff_delivery',''),(5,'staff_sale',''),(6,'staff_finance','');
/*!40000 ALTER TABLE `apiapp_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apiapp_role_permissions`
--

LOCK TABLES `apiapp_role_permissions` WRITE;
/*!40000 ALTER TABLE `apiapp_role_permissions` DISABLE KEYS */;
INSERT IGNORE `apiapp_role_permissions` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(11,1,11),(12,1,12),(13,1,13),(14,1,14),(15,1,15),(16,1,16),(17,1,17),(18,1,18),(19,1,19),(20,1,20),(21,1,21),(22,1,22),(23,1,23),(24,1,24),(25,1,25),(26,1,26),(27,1,27),(28,2,5),(29,2,6),(30,2,7),(31,2,8),(32,2,11),(33,2,26),(34,3,1),(35,3,10),(36,3,12),(37,3,13),(38,3,14),(39,3,26),(40,3,27),(41,4,1),(42,4,3),(43,4,4),(44,4,15),(45,4,16),(46,4,17),(47,4,26),(48,5,1),(49,5,10),(50,5,15),(52,5,26),(53,5,27),(54,6,20),(55,6,21),(56,6,22),(57,6,23),(58,6,26);
/*!40000 ALTER TABLE `apiapp_role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT IGNORE `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add cart',6,'add_cart'),(22,'Can change cart',6,'change_cart'),(23,'Can delete cart',6,'delete_cart'),(24,'Can view cart',6,'view_cart'),(25,'Can add category',7,'add_category'),(26,'Can change category',7,'change_category'),(27,'Can delete category',7,'delete_category'),(28,'Can view category',7,'view_category'),(29,'Can add user',8,'add_customuser'),(30,'Can change user',8,'change_customuser'),(31,'Can delete user',8,'delete_customuser'),(32,'Can view user',8,'view_customuser'),(33,'Can add customer address',9,'add_customeraddress'),(34,'Can change customer address',9,'change_customeraddress'),(35,'Can delete customer address',9,'delete_customeraddress'),(36,'Can view customer address',9,'view_customeraddress'),(37,'Can add product',10,'add_product'),(38,'Can change product',10,'change_product'),(39,'Can delete product',10,'delete_product'),(40,'Can view product',10,'view_product'),(41,'Can add cart item',11,'add_cartitem'),(42,'Can change cart item',11,'change_cartitem'),(43,'Can delete cart item',11,'delete_cartitem'),(44,'Can view cart item',11,'view_cartitem'),(45,'Can add permission',12,'add_permission'),(46,'Can change permission',12,'change_permission'),(47,'Can delete permission',12,'delete_permission'),(48,'Can view permission',12,'view_permission'),(49,'Can add role',13,'add_role'),(50,'Can change role',13,'change_role'),(51,'Can delete role',13,'delete_role'),(52,'Can view role',13,'view_role'),(53,'Can add order',14,'add_order'),(54,'Can change order',14,'change_order'),(55,'Can delete order',14,'delete_order'),(56,'Can view order',14,'view_order'),(57,'Can add order item',15,'add_orderitem'),(58,'Can change order item',15,'change_orderitem'),(59,'Can delete order item',15,'delete_orderitem'),(60,'Can view order item',15,'view_orderitem'),(61,'Can add delivery',16,'add_delivery'),(62,'Can change delivery',16,'change_delivery'),(63,'Can delete delivery',16,'delete_delivery'),(64,'Can view delivery',16,'view_delivery');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT IGNORE `django_content_type` VALUES (1,'admin','logentry'),(6,'apiApp','cart'),(11,'apiApp','cartitem'),(7,'apiApp','category'),(9,'apiApp','customeraddress'),(8,'apiApp','customuser'),(16,'apiApp','delivery'),(14,'apiApp','order'),(15,'apiApp','orderitem'),(12,'apiApp','permission'),(10,'apiApp','product'),(13,'apiApp','role'),(3,'auth','group'),(2,'auth','permission'),(4,'contenttypes','contenttype'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT IGNORE `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-10-03 15:14:54.177683'),(2,'contenttypes','0002_remove_content_type_name','2025-10-03 15:14:54.317279'),(3,'auth','0001_initial','2025-10-03 15:14:54.780297'),(4,'auth','0002_alter_permission_name_max_length','2025-10-03 15:14:54.903507'),(5,'auth','0003_alter_user_email_max_length','2025-10-03 15:14:54.916143'),(6,'auth','0004_alter_user_username_opts','2025-10-03 15:14:54.926504'),(7,'auth','0005_alter_user_last_login_null','2025-10-03 15:14:54.937458'),(8,'auth','0006_require_contenttypes_0002','2025-10-03 15:14:54.941754'),(9,'auth','0007_alter_validators_add_error_messages','2025-10-03 15:14:54.950439'),(10,'auth','0008_alter_user_username_max_length','2025-10-03 15:14:54.959301'),(11,'auth','0009_alter_user_last_name_max_length','2025-10-03 15:14:54.966902'),(12,'auth','0010_alter_group_name_max_length','2025-10-03 15:14:54.987075'),(13,'auth','0011_update_proxy_permissions','2025-10-03 15:14:54.996795'),(14,'auth','0012_alter_user_first_name_max_length','2025-10-03 15:14:55.005267'),(15,'apiApp','0001_initial','2025-10-03 15:14:56.099189'),(16,'admin','0001_initial','2025-10-03 15:14:56.310304'),(17,'admin','0002_logentry_remove_auto_add','2025-10-03 15:14:56.323062'),(18,'admin','0003_logentry_add_action_flag_choices','2025-10-03 15:14:56.333463'),(19,'apiApp','0002_permission_role_customuser_role','2025-10-03 15:14:56.767533'),(20,'apiApp','0003_alter_customuser_username','2025-10-03 15:14:56.915327'),(21,'apiApp','0004_customuser_is_staff_account','2025-10-03 15:14:57.034233'),(22,'apiApp','0005_add_initial_permissions','2025-10-03 15:14:57.163658'),(23,'apiApp','0006_order_orderitem','2025-10-03 15:14:57.413601'),(24,'apiApp','0007_add_chat_permission','2025-10-03 15:14:57.439415'),(25,'apiApp','0008_create_default_admin','2025-10-03 15:14:58.268292'),(26,'apiApp','0009_customuser_created_at','2025-10-03 15:14:58.325132'),(27,'apiApp','0010_remove_customuser_first_name_and_more','2025-10-03 15:14:58.502392'),(28,'apiApp','00011_cart_user','2025-10-03 15:14:58.823009'),(29,'apiApp','0012_delivery','2025-10-03 15:15:02.138626'),(30,'apiApp','00013_alter_cart_cart_code','2025-10-03 15:15:02.229122'),(31,'apiApp','0014_alter_order_status','2025-10-03 15:15:02.248608'),(32,'apiApp','0015_product_quantity_alter_order_status','2025-10-03 15:15:02.345128'),(33,'apiApp','0016_rename_checkout_id_order_stripe_checkout_id','2025-10-03 15:15:02.352086'),(34,'apiApp','0017_order_shipping_city_order_shipping_phone_and_more','2025-10-03 15:15:02.865877'),(35,'sessions','0001_initial','2025-10-03 15:15:02.911462');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-03 22:22:26
