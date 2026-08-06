#!/usr/bin/env python3
"""
Enriquece dados do CSV com fornecedores inteligentes e categorias melhores.
- Mapeia descrição → fornecedor padrão
- Melhora categorização
- Adiciona informações faltantes
"""

import csv
import json
from datetime import datetime, timedelta
from uuid import uuid4

# Mapeamento inteligente: descrição → fornecedor padrão
FORNECEDOR_MAP = {
    "ferro": "Aço Brazil",
    "aço": "Aço Brazil",
    "arame": "Aço Brazil",
    "cimento": "Depósito Central",
    "areia": "Depósito Central",
    "brita": "Depósito Central",
    "cal": "Depósito Central",
    "reboco": "Depósito Central",
    "pedreiro": "Equipe Local",
    "servente": "Equipe Local",
    "bônus": "Equipe Local",
    "alimentação": "Equipe Local",
    "arquiteto": "Arquiteto Maurício",
    "cartório": "Cartório de Coremas",
    "rrt": "CAU - PB",
    "casamba": "Locadora Feliphe",
    "escavadeira": "Locadora Feliphe",
    "frete": "Transporte Local",
    "gasolina": "Posto Local",
    "tijolo": "Cerâmica Boa Vista",
    "bloco": "Cerâmica Boa Vista",
    "telha": "Cerâmica Boa Vista",
    "cano": "Hidráulica Vale",
    "tubo": "Hidráulica Vale",
    "encanador": "Encanador Local",
    "eletro": "Elétrica Ponto Certo",
    "fio": "Elétrica Ponto Certo",
    "cabo": "Elétrica Ponto Certo",
    "madeira": "Madeireira São José",
    "tábua": "Madeireira São José",
    "porcelanato": "Casa do Acabamento",
    "tinta": "Casa do Acabamento",
    "pintor": "Pintor Local",
    "azulejista": "Azulejos Elite",
    "louça": "Hidráulica Vale",
    "vaso": "Hidráulica Vale",
}

def get_fornecedor(desc: str, current: str = "") -> str:
    """Retorna fornecedor baseado na descrição"""
    if current and current != "--":
        return current

    desc_lower = (desc or "").lower()
    for keyword, fornecedor in FORNECEDOR_MAP.items():
        if keyword in desc_lower:
            return fornecedor

    return None

def categorize_smart(desc: str, unit: str = "") -> str:
    """Categoriza com mais inteligência usando categorias válidas do app"""
    desc_lower = (desc or "").lower()

    # Mão de obra
    if any(w in desc_lower for w in ["pedreiro", "servente", "diária", "mão de obra", "pintor", "azulejista", "encanador", "eletricista"]):
        return "mao_de_obra"

    # Elétrica
    if any(w in desc_lower for w in ["eletro", "fio", "cabo", "luz", "quadro", "circuito"]):
        return "eletrica"

    # Hidráulica
    if any(w in desc_lower for w in ["cano", "tubo", "água", "encanação", "louça", "vaso", "pia"]):
        return "hidraulica"

    # Pintura
    if any(w in desc_lower for w in ["tinta", "pintor", "massa", "reboco"]):
        return "pintura"

    # Esquadrias
    if any(w in desc_lower for w in ["janela", "porta", "esquadria", "alumínio", "vidro"]):
        return "esquadrias"

    # Revestimentos
    if any(w in desc_lower for w in ["porcelanato", "azulejo", "argamassa", "piso", "parede"]):
        return "revestimentos"

    # Cobertura
    if any(w in desc_lower for w in ["telha", "telhado", "cobertura", "madeiramento"]):
        return "cobertura"

    # Alvenaria
    if any(w in desc_lower for w in ["tijolo", "bloco", "cerâmica", "alvenaria"]):
        return "alvenaria"

    # Estrutura
    if any(w in desc_lower for w in ["ferro", "aço", "concreto", "laje", "viga"]):
        return "estrutura"

    # Fundação
    if any(w in desc_lower for w in ["fundação", "escavação", "brita", "areia", "cimento", "sapata"]):
        return "fundacao"

    # Serviços preliminares/externos
    if any(w in desc_lower for w in ["arquiteto", "cartório", "rrt", "casamba", "escavadeira", "frete", "gasolina", "locação", "aluguel", "limpeza", "terraplanagem"]):
        return "preliminares"

    # Default
    return "outros"

def main():
    csv_path = "/Users/marceloazevedo/workspace/speckit-springboot-thymeleaf/planilha_completa_obra.csv"

    print("🔄 Enriquecendo dados...")

    expenses = []
    with open(csv_path, encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)

        for row in reader:
            if len(row) < 5 or not row[0].strip():
                continue
            if row[5] == "R$ 0,00" and not row[0].strip():
                continue

            try:
                date_str = row[0].strip()
                if not date_str or len(date_str) < 8:
                    continue

                date_parts = date_str.split("/")
                date_obj = datetime(int(date_parts[2]), int(date_parts[1]), int(date_parts[0]))

                desc = row[1].strip() if len(row) > 1 and row[1].strip() else ""
                if not desc:
                    unit = row[2].strip() if len(row) > 2 else "un"
                    qty = row[3].strip() if len(row) > 3 else "1"
                    desc = f"{qty} {unit}".strip()

                unit = row[2].strip() if len(row) > 2 else ""
                qty_str = row[3].strip() if len(row) > 3 else "0"
                unit_value_str = row[4].strip() if len(row) > 4 else "0"
                total_str = row[5].strip() if len(row) > 5 else "0"
                supplier_old = row[6].strip() if len(row) > 6 else ""

                # 🎯 ENRIQUECIMENTO: Fornecedor inteligente
                supplier = get_fornecedor(desc, supplier_old if supplier_old != "--" else "")

                # 🎯 ENRIQUECIMENTO: Categoria inteligente
                category = categorize_smart(desc, unit)

                # Conversões
                def parse_brl(v):
                    if not v or v == "--":
                        return 0
                    cleaned = v.replace("R$", "").strip().replace(".", "").replace(",", ".")
                    try:
                        return int(float(cleaned) * 100)
                    except:
                        return 0

                def parse_qty(v):
                    if not v or v == "--":
                        return 0
                    try:
                        return int(float(v) * 1000)
                    except:
                        return 0

                amount_cents = parse_brl(total_str)
                qty_millisiths = parse_qty(qty_str)
                unit_value_cents = parse_brl(unit_value_str)


                payment_method = row[10].strip() if len(row) > 10 else None
                if not payment_method or payment_method == "--":
                    payment_method = None

                bank = row[12].strip() if len(row) > 12 else None
                if bank == "--" or not bank:
                    bank = None

                obs = row[13].strip() if len(row) > 13 else ""

                expense = {
                    "id": str(uuid4()),
                    "date": date_obj.strftime("%Y-%m-%d"),
                    "description": desc,
                    "amount": amount_cents,
                    "unit": unit if unit else None,
                    "quantity": qty_millisiths,
                    "unitValue": unit_value_cents,
                    "supplier": supplier,  # 🎯 ENRIQUECIDO
                    "paymentMethod": payment_method,
                    "bank": bank,
                    "categoryId": category,  # 🎯 MELHORADO
                    "notes": obs,
                    "createdAt": (date_obj + timedelta(hours=10)).isoformat() + "Z",
                    "updatedAt": (date_obj + timedelta(hours=10)).isoformat() + "Z",
                }

                expenses.append(expense)
            except Exception as e:
                print(f"⚠️  Erro: {e}")
                continue

    print(f"✅ {len(expenses)} gastos enriquecidos")

    # Análise
    com_fornecedor = sum(1 for e in expenses if e["supplier"])
    por_categoria = {}
    for e in expenses:
        cat = e["categoryId"]
        por_categoria[cat] = por_categoria.get(cat, 0) + 1

    print(f"\n📊 RESULTADO:")
    print(f"  Com fornecedor: {com_fornecedor}/{len(expenses)} ({com_fornecedor/len(expenses)*100:.1f}%)")
    print(f"  Por categoria:")
    for cat, count in sorted(por_categoria.items(), key=lambda x: x[1], reverse=True):
        print(f"    • {cat}: {count}")

    # Entradas
    entries = [
        {
            "id": str(uuid4()),
            "date": "2025-02-01",
            "description": "Aporte inicial do sócio",
            "amount": 100000_00,
            "supplier": "Sócio",
            "createdAt": "2025-02-01T08:00:00Z",
            "updatedAt": "2025-02-01T08:00:00Z",
        },
        {
            "id": str(uuid4()),
            "date": "2025-05-01",
            "description": "Financiamento bancário",
            "amount": 150000_00,
            "supplier": "Banco",
            "createdAt": "2025-05-01T09:00:00Z",
            "updatedAt": "2025-05-01T09:00:00Z",
        },
    ]

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

    output_path = "/Users/marceloazevedo/workspace/speckit-springboot-thymeleaf/frontend-react/src/lib/demo-data.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Exportado: {output_path}")

if __name__ == "__main__":
    main()
