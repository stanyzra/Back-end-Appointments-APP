import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../../models/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const AppointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      AppointmentDate,
    );

    if (findAppointmentInSameDate) { // COLOCAMOS AWAIT AQUI SÓ PRA TIRAR O ERRO
      throw Error('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: AppointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
