from django import forms
from .models import Booking
from django.utils import timezone
from django.db.models import Q


class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['start_booking', 'end_booking']

    def clean(self):
        cleaned_data = super().clean()
        start_booking = cleaned_data.get("start_booking")
        end_booking = cleaned_data.get("end_booking")

        # Проверка на даты
        if start_booking and end_booking:
            if start_booking < timezone.now().date():
                raise forms.ValidationError("Дата начала не может быть в прошлом.")
            if start_booking >= end_booking:
                raise forms.ValidationError("Дата начала должна быть раньше даты конца.")

        # Проверка на пересечение с существующими бронированиями
        bookings = Booking.objects.filter(
            (Q(start_booking__lte=end_booking) & Q(end_booking__gte=start_booking))
        )
        if bookings.exists():
            raise forms.ValidationError("Эти даты уже забронированы.")