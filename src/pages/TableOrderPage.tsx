import { useEffect }       from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable }               from '../contexts/TableContext';

export default function TableOrderPage() {
  const { tableId }   = useParams<{ tableId: string }>();
  const { setTableId }= useTable();
  const navigate      = useNavigate();

  useEffect(() => {
    if (!tableId || isNaN(Number(tableId))) {
      navigate('/', { replace: true });
      return;
    }
    setTableId(tableId);            // Context + localStorage
    navigate('/menu', { replace: true });
  }, [tableId, setTableId, navigate]);

  return null;
}
