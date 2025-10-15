#!/bin/bash

# Script para insertar datos de ejemplo en LocalStack para La Huella
# Este script debe ejecutarse después de crear los recursos básicos

echo "🌱 Insertando datos de ejemplo en LocalStack..."

# Configuración de variables
REGION="eu-west-1"
ENDPOINT="http://midominio.local"

# Función para verificar si un comando fue exitoso
check_command() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ Error en: $1"
        exit 1
    fi
}

# Productos de ejemplo
echo "📦 Insertando productos de ejemplo..."

aws --endpoint-url=http://midominio.local dynamodb put-item \
    --table-name la-huella-products \
    --item '{
        "id": {"S": "prod-001"},
        "name": {"S": "Zapatillas Running Pro"},
        "category": {"S": "running"},
        "price": {"N": "89.99"},
        "description": {"S": "Zapatillas profesionales para running con tecnología de amortiguación avanzada"},
        "imageUrl": {"S": "https://example.com/running-pro.jpg"},
        "createdAt": {"S": "2024-01-15T10:00:00Z"}
    }' \
    --region $REGION

aws --endpoint-url=http://midominio.local dynamodb put-item \
    --table-name la-huella-products \
    --item '{
        "id": {"S": "prod-002"},
        "name": {"S": "Botas Montaña Explorer"},
        "category": {"S": "hiking"},
        "price": {"N": "129.99"},
        "description": {"S": "Botas resistentes para montaña con membrana impermeable"},
        "imageUrl": {"S": "https://example.com/hiking-explorer.jpg"},
        "createdAt": {"S": "2024-01-16T11:00:00Z"}
    }' \
    --region $REGION

aws --endpoint-url=http://midominio.local dynamodb put-item \
    --table-name la-huella-products \
    --item '{
        "id": {"S": "prod-003"},
        "name": {"S": "Sandalias Verano Comfort"},
        "category": {"S": "casual"},
        "price": {"N": "45.99"},
        "description": {"S": "Sandalias cómodas para el verano con suela ergonómica"},
        "imageUrl": {"S": "https://example.com/summer-comfort.jpg"},
        "createdAt": {"S": "2024-01-17T12:00:00Z"}
    }' \
    --region $REGION

check_command "Productos de ejemplo insertados"

# Comentarios de ejemplo con diferentes sentimientos
echo "💬 Insertando comentarios de ejemplo..."

aws --endpoint-url=http://midominio.local dynamodb put-item \
    --table-name la-huella-comments \
    --item '{
        "id": {"S": "comment-001"},
        "productId": {"S": "prod-001"},
        "userId": {"S": "user-001"},
        "userName": {"S": "María García"},
        "comment": {"S": "Excelentes zapatillas, muy cómodas para correr largas distancias. Las recomiendo totalmente."},
        "sentiment": {"S": "positive"},
        "sentimentScore": {"N": "0.89"},
        "rating": {"N": "5"},
        "createdAt": {"S": "2024-01-20T14:30:00Z"},
        "processed": {"BOOL": true}
    }' \
    --region $REGION

aws --endpoint-url=http://midominio.local dynamodb put-item \
    --table-name la-huella-comments \
    --item '{
        "id": {"S": "comment-002"},
        "productId": {"S": "prod-001"},
        "userId": {"S": "user-002"},
        "userName": {"S": "Carlos Ruiz"},
        "comment": {"S": "El producto llegó defectuoso, la suela se despegó después de una semana. Muy decepcionado."},
        "sentiment": {"S": "negative"},
        "sentimentScore": {"N": "0.12"},
        "rating": {"N": "1"},
        "createdAt": {"S": "2024-01-21T09:15:00Z"},
        "processed": {"BOOL": true}
    }' \
    --region $REGION

aws --endpoint-url=http://midominio.local dynamodb put-item \
    --table-name la-huella-comments \
    --item '{
        "id": {"S": "comment-003"},
        "productId": {"S": "prod-002"},
        "userId": {"S": "user-003"},
        "userName": {"S": "Ana López"},
        "comment": {"S": "Las botas están bien, cumplen su función pero esperaba mejor calidad por el precio."},
        "sentiment": {"S": "neutral"},
        "sentimentScore": {"N": "0.55"},
        "rating": {"N": "3"},
        "createdAt": {"S": "2024-01-22T16:45:00Z"},
        "processed": {"BOOL": true}
    }' \
    --region $REGION

check_command "Comentarios de ejemplo insertados"

echo "🎉 ¡Datos de ejemplo insertados correctamente!"
echo "📋 Datos insertados:"
echo "   - 3 productos: Zapatillas Running Pro, Botas Montaña Explorer, Sandalias Verano Comfort"
echo "   - 3 comentarios: 1 positivo, 1 negativo, 1 neutral"
echo ""
echo "🔗 Acceso a LocalStack: http://midominio.local"
