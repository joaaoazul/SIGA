// src/modules/trainer/pages/Scheduling/components/CancelScheduleModal.js
import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import emailService from '../../../../../services/emails/emailService';

const CancelScheduleModal = ({ schedule, isOpen, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [notifyAthlete, setNotifyAthlete] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  if (!isOpen) return null;

  const handleCancel = async () => {
    setCancelling(true);

    try {
      // Atualizar status no banco
      const { error } = await supabase
        .from('schedules')
        .update({
          status: 'cancelled',
          cancelled_reason: reason,
          cancelled_at: new Date().toISOString(),
          cancelled_by: schedule.trainer_id
        })
        .eq('id', schedule.id);

      if (error) throw error;

      // Enviar notificação se solicitado
      if (notifyAthlete && schedule.athlete?.email) {
        await emailService.sendCancellationNotice(schedule, reason);
        
        // Criar log de notificação
        await supabase.from('schedule_notifications').insert({
          schedule_id: schedule.id,
          recipient_id: schedule.athlete_id,
          type: 'cancellation',
          channel: 'email',
          status: 'sent',
          message: reason,
          sent_at: new Date().toISOString()
        });
      }

      toast.success('Agendamento cancelado com sucesso');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      toast.error('Erro ao cancelar agendamento');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Cancelar Agendamento</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info do agendamento */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">{schedule.title}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>📅 {new Date(schedule.scheduled_date).toLocaleDateString('pt-PT')}</p>
              <p>⏰ {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}</p>
              <p>👤 {schedule.athlete?.full_name || schedule.athlete?.name}</p>
            </div>
          </div>

          {/* Motivo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo do cancelamento
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Opcional: Explique o motivo do cancelamento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Notificar atleta */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyAthlete}
              onChange={(e) => setNotifyAthlete(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">
              Notificar atleta por email
            </span>
          </label>

          {/* Aviso */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ Esta ação não pode ser revertida. O atleta será notificado do cancelamento.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Manter Agendamento
          </button>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {cancelling ? (
              <>Cancelando...</>
            ) : (
              <>
                <AlertTriangle size={18} />
                Confirmar Cancelamento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelScheduleModal;