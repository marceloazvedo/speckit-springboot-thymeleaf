#!/usr/bin/env python3
"""
Transforma planilha_completa_obra.csv em JSON pronto pro demo do app.
- Parse CSV
- Completa descrições
- Atribui categorias
- Converte BRL → centavos, qtd → milésimos
- Gera UUIDs v7 e timestamps RFC 3339
- Adiciona Entradas
"""

import csv
import json
import re
from datetime import datetime, timedelta
from uuid import uuid4
from pathlib import Path

# Mapeamento de categorias por palavras-chave
CATEGORY_MAP = {
    "ferro": "material",
    "cimento": "material",
    "arame": "material",
    "areia": "material",
    "brita": "material",
    "saco": "material",
    "cano": "material",
    "registro": "material",
    "disco": "material",
    "viscose": "material",
    "rebocel": "material",
    "balde": "material",
    "tábua": "material",
    "tabua": "material",
    "tijolos": "material",
    "tijolo": "material",
    "pedreiro": "labor",
    "servente": "labor",
    "bônus": "labor",
    "alimentação": "labor",
    "alimentacao": "labor",
    "arquiteto": "service",
    "cartório": "service",
    "cartorio": "service",
    "rrt": "service",
    "casamba": "service",
    "escavadeira": "service",
    "frete": "service",
    "gasolina": "service",
    "pagamento": "service",
    "desmembramento": "service",
}

def parse_brl(value: str) -> int:
    """Converte 'R$ 1.200,50' → 120050 (centavos)"""
    if not value or value == "--":
        return 0
    # Remove 'R$', espaços, pontos (separador de mil), e substitui vírgula por ponto
    cleaned = value.replace("R$", "").strip().replace(".", "").replace(",", ".")
    try:
        return int(float(cleaned) * 100)
    except:
        return 0

def parse_qty(value: str) -> int:
    """Converte '25' ou '1.5' → milésimos (inteiro)"""
    if not value or value == "--":
        return 0
    try:
        return int(float(value) * 1000)
    except:
        return 0

def categorize(description: str) -> str:
    """Mapeia descrição para categoria"""
    desc_lower = (description or "").lower()
    for keyword, category in CATEGORY_MAP.items():
        if keyword in desc_lower:
            return category
    return "other"

def rfc3339_now() -> str:
    """Retorna timestamp RFC 3339"""
    return datetime.utcnow().isoformat() + "Z"

def uuid7() -> str:
    """Gera UUID v7 (para demo, usamos v4)"""
    return str(uuid4())

def main():
    csv_path = Path("/Users/marceloazevedo/workspace/speckit-springboot-thymeleaf/planilha_completa_obra.csv")
    output_path = Path("/Users/marceloazevedo/workspace/speckit-springboot-thymeleaf/frontend-react/src/lib/demo-data.json")

    # Lê CSV
    expenses = []
    with open(csv_path, encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)  # Pula cabeçalho

        for row in reader:
            # Pula linhas vazias ou muito curtas
            if len(row) < 5 or not row[0].strip():
                continue

            # Pula linhas de lixo (últimas com "R$ 0,00")
            if len(row) > 5 and row[5] == "R$ 0,00" and not row[0].strip():
                continue

            # Índices: 0=Data, 1=Desc, 2=Unit, 3=Qty, 4=ValUnit, 5=ValTotal, 6=Fornecedor, 7=Pago, 8=Entregue, 9=QtdEntregue, 10=FormaPgto, 11=NotaFiscal, 12=Banco, 13=Obs
            try:
                date_str = row[0].strip()
                if not date_str or len(date_str) < 8:
                    continue

                # Parse data (DD/MM/YYYY)
                date_parts = date_str.split("/")
                date_obj = datetime(int(date_parts[2]), int(date_parts[1]), int(date_parts[0]))

                # Descrição: usa col[1] se tiver, senão tenta unidade+qtd+obs
                desc = row[1].strip() if len(row) > 1 and row[1].strip() else ""
                if not desc:
                    # Fallback: "25 Un Ferro" ou "1 Serviço"
                    unit = row[2].strip() if len(row) > 2 else "un"
                    qty = row[3].strip() if len(row) > 3 else "1"
                    desc = f"{qty} {unit}".strip()

                obs = row[13].strip() if len(row) > 13 else ""
                if obs and obs not in desc:
                    desc = f"{desc} ({obs})" if desc else obs

                unit = row[2].strip() if len(row) > 2 else ""
                qty_str = row[3].strip() if len(row) > 3 else "0"
                unit_value_str = row[4].strip() if len(row) > 4 else "0"
                total_str = row[5].strip() if len(row) > 5 else "0"
                supplier = row[6].strip() if len(row) > 6 else ""
                paid_str = row[7].strip().lower() if len(row) > 7 else "não"
                delivered_str = row[8].strip().lower() if len(row) > 8 else "não"
                qty_delivered_str = row[9].strip() if len(row) > 9 else ""
                payment_method = row[10].strip() if len(row) > 10 else ""
                bank = row[12].strip() if len(row) > 12 else ""

                # Conversões
                amount_cents = parse_brl(total_str)
                qty_millisiths = parse_qty(qty_str)
                unit_value_cents = parse_brl(unit_value_str)

                # Booleans
                paid = paid_str in ["sim", "yes", "true", "1"]
                delivered = delivered_str in ["sim", "yes", "true", "1"]

                # Qty delivered (se "Uma parte" ou número)
                qty_delivered = 0
                if qty_delivered_str and qty_delivered_str.isdigit():
                    qty_delivered = parse_qty(qty_delivered_str)
                elif delivered_str == "uma parte":
                    qty_delivered = qty_millisiths // 2  # Metade como fallback

                # Limpa fornecedor
                if supplier == "--" or not supplier:
                    supplier = None

                # Limpa banco
                if bank == "--" or not bank:
                    bank = None

                # Limpa pagamento
                if not payment_method or payment_method == "--":
                    payment_method = None

                expense = {
                    "id": uuid7(),
                    "projectId": "demo-project-id",  # Será substituído
                    "date": date_obj.strftime("%Y-%m-%d"),
                    "description": desc,
                    "amount": amount_cents,
                    "unit": unit if unit else None,
                    "quantity": qty_millisiths,
                    "unitValue": unit_value_cents,
                    "supplier": supplier,
                    "paid": paid,
                    "delivered": delivered,
                    "deliveredQty": qty_delivered,
                    "paymentMethod": payment_method,
                    "bank": bank,
                    "categoryId": categorize(desc),
                    "notes": obs,
                    "createdAt": (date_obj + timedelta(hours=10)).isoformat() + "Z",  # 10h naquele dia
                    "updatedAt": (date_obj + timedelta(hours=10)).isoformat() + "Z",
                    "deletedAt": None,
                }

                expenses.append(expense)
            except Exception as e:
                print(f"⚠️  Erro processando linha {row}: {e}")
                continue

    print(f"✅ {len(expenses)} gastos importados")

    # Adiciona Entradas
    entries = [
        {
            "id": uuid7(),
            "projectId": "demo-project-id",
            "date": "2025-02-01",
            "description": "Aporte inicial do sócio",
            "amount": 100000_00,  # R$ 100.000
            "supplier": "Sócio X",
            "createdAt": datetime(2025, 2, 1, 8, 0).isoformat() + "Z",
            "updatedAt": datetime(2025, 2, 1, 8, 0).isoformat() + "Z",
            "deletedAt": None,
        },
        {
            "id": uuid7(),
            "projectId": "demo-project-id",
            "date": "2025-05-01",
            "description": "Financiamento bancário",
            "amount": 150000_00,  # R$ 150.000
            "supplier": "Banco Y",
            "createdAt": datetime(2025, 5, 1, 9, 0).isoformat() + "Z",
            "updatedAt": datetime(2025, 5, 1, 9, 0).isoformat() + "Z",
            "deletedAt": None,
        },
    ]

    print(f"✅ {len(entries)} entradas adicionadas")

    # Output
    data = {
        "project": {
            "id": "demo-project-id",
            "name": "Minha Casa",
            "createdAt": "2025-02-01T08:00:00Z",
            "updatedAt": "2025-02-01T08:00:00Z",
            "deletedAt": None,
        },
        "expenses": expenses,
        "entries": entries,
    }

    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Exportado: {output_path}")
    print(f"   Total: {len(expenses)} gastos + {len(entries)} entradas")
    print(f"   Período: {min(e['date'] for e in expenses)} → {max(e['date'] for e in expenses)}")

if __name__ == "__main__":
    main()
