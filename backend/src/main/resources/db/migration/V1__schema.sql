CREATE TABLE app_user (id BIGSERIAL PRIMARY KEY, email VARCHAR(254) NOT NULL UNIQUE, password_hash VARCHAR(100) NOT NULL, full_name VARCHAR(120) NOT NULL, role VARCHAR(15) NOT NULL DEFAULT 'CUSTOMER', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE category (id BIGSERIAL PRIMARY KEY, slug VARCHAR(60) UNIQUE NOT NULL, name VARCHAR(90) NOT NULL);
CREATE TABLE product (id BIGSERIAL PRIMARY KEY, category_id BIGINT NOT NULL REFERENCES category(id), name VARCHAR(120) NOT NULL, description TEXT NOT NULL DEFAULT '', image_path VARCHAR(255), price_cents BIGINT NOT NULL CHECK(price_cents>=0), active BOOLEAN NOT NULL DEFAULT true, made_to_order BOOLEAN NOT NULL DEFAULT true);
CREATE TABLE product_option (id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE, kind VARCHAR(40) NOT NULL, label VARCHAR(100) NOT NULL, extra_cents BIGINT NOT NULL DEFAULT 0 CHECK(extra_cents>=0), image_path VARCHAR(255));
CREATE TABLE customer_order (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES app_user(id), status VARCHAR(25) NOT NULL DEFAULT 'PENDING', payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID', total_cents BIGINT NOT NULL CHECK(total_cents>=0), customer_note VARCHAR(2000), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE order_line (id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE, product_name VARCHAR(120) NOT NULL, quantity INT NOT NULL CHECK(quantity>0), unit_price_cents BIGINT NOT NULL CHECK(unit_price_cents>=0), options_snapshot TEXT NOT NULL);
CREATE INDEX idx_order_user ON customer_order(user_id,created_at DESC);
CREATE INDEX idx_order_status ON customer_order(status);
INSERT INTO category(slug,name) VALUES ('oursons','Oursons & compagnies'),('bouquets','Bouquets composés'),('compositions','Compositions sur mesure'),('fondants','Fondants parfumés'),('fleurs','Fleurs à offrir'),('fragrances','Fragrances');
INSERT INTO product(category_id,name,description,image_path,price_cents) VALUES
 ((SELECT id FROM category WHERE slug='oursons'),'Ourson S','Création parfumée faite à la demande.','/assets/images/Item_Bougie.x6.jpg',800),
 ((SELECT id FROM category WHERE slug='oursons'),'Ourson M','Création parfumée faite à la demande.','/assets/images/Item_Bougie.x6.jpg',1200),
 ((SELECT id FROM category WHERE slug='oursons'),'Ourson L','Création parfumée faite à la demande.','/assets/images/Item_Bougie.x6.jpg',1600),
 ((SELECT id FROM category WHERE slug='bouquets'),'Bouquet S','Environ huit bougies, tarif à partir de.','/assets/images/bouquet_de_bougie.jpg',4500),
 ((SELECT id FROM category WHERE slug='bouquets'),'Bouquet M','Bouquet confectionné à la demande, tarif à partir de.','/assets/images/bouquet_anniv.jpg',6500),
 ((SELECT id FROM category WHERE slug='bouquets'),'Bouquet L','Composition florale parfumée, tarif à partir de.','/assets/images/bouquet_de_bougie.jpg',9000),
 ((SELECT id FROM category WHERE slug='bouquets'),'Bouquet XL et +','Composition généreuse, sur devis.','/assets/images/bouquet_anniv.jpg',13000),
 ((SELECT id FROM category WHERE slug='compositions'),'Composition sur mesure','Prix à partir de, à confirmer selon votre demande.','/assets/images/bouquet_anniv.jpg',8000),
 ((SELECT id FROM category WHERE slug='fondants'),'Fondant parfumé','Prix indicatif à partir de 3,50 € selon le modèle.','/assets/images/parfum.jpg',350),
 ((SELECT id FROM category WHERE slug='fleurs'),'Une fleur à offrir','Une fleur parfumée, selon les modèles proposés.','/assets/images/bouquet_de_bougie.jpg',500);
INSERT INTO product_option(product_id,kind,label,extra_cents) SELECT id,'Couleur','Crème',0 FROM product WHERE name LIKE 'Ourson%';
INSERT INTO product_option(product_id,kind,label,extra_cents) SELECT id,'Couleur','Rose poudré',0 FROM product WHERE name LIKE 'Ourson%';
INSERT INTO product_option(product_id,kind,label,extra_cents) SELECT id,'Couleur','Beige',0 FROM product WHERE name LIKE 'Ourson%';
