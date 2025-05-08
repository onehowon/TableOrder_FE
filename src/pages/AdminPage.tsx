import { useEffect, useState } from 'react';
import api from '../api';

interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export default function AdminPage() {
  const [tab, setTab] = useState<'menu' | 'order' | 'table'>('menu');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    file: null as File | null,
  });
  const [editId, setEditId] = useState<number | null>(null);

  const fetchMenus = () => {
    api.get('/admin/menus')
      .then(res => setMenus(res.data.data))
      .catch(console.error);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const fillForm = (menu: Menu) => {
    setForm({
      name: menu.name,
      description: menu.description,
      price: String(menu.price),
      isAvailable: menu.isAvailable,
      file: null,
    });
    setEditId(menu.id);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    api.delete(`/admin/menus/${id}`)
      .then(fetchMenus)
      .catch(console.error);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('isAvailable', String(form.isAvailable));
    if (form.file) formData.append('file', form.file);

    const request = editId
      ? api.put(`/admin/menus/${editId}`, formData)
      : api.post('/admin/menus', formData);

    request.then(() => {
      fetchMenus();
      setForm({ name: '', description: '', price: '', isAvailable: true, file: null });
      setEditId(null);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setTab('menu')} style={{ fontWeight: tab === 'menu' ? 'bold' : 'normal' }}>메뉴 관리</button>
        <button onClick={() => setTab('order')} style={{ fontWeight: tab === 'order' ? 'bold' : 'normal' }}>주문 관리</button>
        <button onClick={() => setTab('table')} style={{ fontWeight: tab === 'table' ? 'bold' : 'normal' }}>테이블 요약</button>
      </div>
      {tab === 'menu' && (
        <div style={{ marginBottom: 24 }}>
          <input style={{ border: '1px solid #ccc', padding: 8, marginRight: 8 }} name="name" value={form.name} placeholder="이름" onChange={handleInput} />
          <input style={{ border: '1px solid #ccc', padding: 8, marginRight: 8 }} name="price" value={form.price} placeholder="가격" type="number" onChange={handleInput} />
          <textarea style={{ border: '1px solid #ccc', padding: 8, marginRight: 8 }} name="description" value={form.description} placeholder="설명" onChange={handleInput} />
          <label style={{ marginRight: 8 }}>
            <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleInput} /> 판매중
          </label>
          <input type="file" accept="image/*" onChange={handleFile} />
          <button style={{ background: '#2563eb', color: 'white', padding: '8px 16px', marginLeft: 8 }} onClick={handleSubmit}>
            {editId ? '수정 완료' : '메뉴 추가'}
          </button>
          {editId && (
            <button style={{ marginLeft: 8, color: '#888' }} onClick={() => { setEditId(null); setForm({ name: '', description: '', price: '', isAvailable: true, file: null }); }}>
              취소
            </button>
          )}
        </div>
      )}
      {tab === 'order' && (
        <div>주문 관리 페이지 (목업) - 추후 구현</div>
      )}
      {tab === 'table' && (
        <div>테이블 요약 페이지 (목업) - 추후 구현</div>
      )}
      <ul style={{ padding: 0 }}>
        {menus.map(menu => (
          <li key={menu.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
            <p style={{ fontWeight: 'bold' }}>{menu.name} - {menu.price}원</p>
            <p>{menu.description}</p>
            {menu.imageUrl && <img src={menu.imageUrl} alt={menu.name} style={{ width: 96, marginTop: 4 }} />}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => fillForm(menu)} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>수정</button>
              <button onClick={() => handleDelete(menu.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 