import { useEffect, useState } from 'react';
import { useTable }    from '../contexts/TableContext';
import { useCart }     from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import api             from '../api';

interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function MenuPage() {
  const { tableId } = useTable();
  const { addItem } = useCart();
  const navigate    = useNavigate();

  const [menus, setMenus]       = useState<Menu[]>([]);
  const [qtyMap, setQtyMap]     = useState<Record<number, number>>({});

  useEffect(() => {
    if (!tableId) {
      navigate('/', { replace: true });
      return;
    }
    const fetchMenus = async () => {
      try {
        const res = await api.get('/customer/menus');
        setMenus(res.data.data);
      } catch (err) {
        console.error('메뉴 조회 실패:', err);
      }
    };
    fetchMenus();
  }, [tableId, navigate]);

  const handleQtyChange = (menuId: number, qty: number) => {
    setQtyMap(prev => ({ ...prev, [menuId]: qty }));
  };

  const handleAddToCart = (menu: Menu) => {
    const qty = qtyMap[menu.id] || 1;
    addItem({ menuId: menu.id, name: menu.name, price: menu.price }, qty);
  };

  return (
    <div className="px-2 py-4 max-w-lg mx-auto sm:px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">메뉴</h1>
      <ul className="flex flex-col gap-4">
        {menus.map(menu => (
          <li
            key={menu.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">{menu.name}</p>
              <p className="text-gray-500 text-sm mb-1 break-words">
                {menu.description}
              </p>
              <p className="font-semibold text-blue-700 mb-2">
                {menu.price.toLocaleString()}원
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={1}
                  value={qtyMap[menu.id] || 1}
                  onChange={e =>
                    handleQtyChange(menu.id, Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => handleAddToCart(menu)}
                  className="bg-blue-600 text-white rounded px-4 py-1 font-semibold hover:bg-blue-700 transition"
                >
                  장바구니 담기
                </button>
              </div>
            </div>
            {menu.imageUrl && (
              <img
                src={menu.imageUrl}
                alt={menu.name}
                className="w-24 h-24 object-cover rounded-lg mx-auto sm:mx-0"
              />
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate('/order/confirm')}
        className="fixed right-4 bottom-4 bg-blue-600 text-white rounded-full px-8 py-4 text-lg font-bold shadow-lg hover:bg-blue-700 transition sm:right-8 sm:bottom-8"
      >
        장바구니 확인
      </button>
    </div>
  );
}
