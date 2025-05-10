import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerMenus } from '../api';
import { useCart } from '../contexts/CartContext';
import { useTable } from '../contexts/TableContext';

interface MenuDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuDTO[]>([]);
  const { addItem } = useCart();
  const [qty, setQty] = useState<Record<number, number>>({});
  const { tableId } = useTable();
  const navigate = useNavigate();

  // 1) 테이블 미설정 시 웰컴으로
  useEffect(() => {
    if (!tableId) {
      navigate('/welcome');
    }
  }, [tableId, navigate]);

  // 2) 활성 메뉴만 조회
  useEffect(() => {
    getCustomerMenus()
      .then(list => setMenus(list))
      .catch(() => alert('메뉴를 불러오지 못했습니다.'));
  }, []);

  // 3) 담기 후 확인 페이지로
  const onOrder = () => {
    navigate('/order/confirm');
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center mb-10">메뉴</h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map(m => (
          <div key={m.id} className="bg-zinc-800 rounded-xl p-4 flex flex-col">
            {m.imageUrl && (
              <img
                src={m.imageUrl}
                alt={m.name}
                className="rounded-lg aspect-square object-cover mb-3"
              />
            )}
            <h3 className="font-semibold text-lg">{m.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-2">{m.description}</p>
            <b className="mb-3">{m.price.toLocaleString()}원</b>

            <div className="mt-auto flex gap-2">
              <input
                type="number"
                min={1}
                value={qty[m.id] ?? 1}
                onChange={e =>
                  setQty(q => ({ ...q, [m.id]: +e.target.value || 1 }))
                }
                className="w-16 bg-zinc-900 border border-zinc-700 rounded text-center"
              />
              <button
                onClick={() =>
                  addItem(
                    { menuId: m.id, name: m.name, price: m.price },
                    qty[m.id] ?? 1
                  )
                }
                className="flex-1 btn-primary"
              >
                담기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 장바구니에 담긴 뒤 주문 확인으로 */}
      <div className="mt-10 flex justify-center">
        <button onClick={onOrder} className="btn-call w-1/2">
          주문 확인
        </button>
      </div>
    </div>
  );
}
