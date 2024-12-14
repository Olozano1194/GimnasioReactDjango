from django import forms
from . models import RegistrarUsuario, RegistrarUsuarioGym, RegistrarUsuarioGymDay, Renovacion


class UsuarioForm(forms.ModelForm):
    class Meta:
        model = RegistrarUsuario
        fields = [
            'name',
            'lastname',
            'user',
            'email',
            'roles',
            'password',           
        ]

class UsuarioFormGym(forms.ModelForm):
    class Meta:
        model = RegistrarUsuarioGym
        fields = [
            'name',
            'lastname',
            'phone',
            'address',
            'dateInitial',
            'dateFinal',
                
        ]

class UsuarioFormGymDay(forms.ModelForm):
    class Meta:
        model = RegistrarUsuarioGymDay
        fields = [
            'name',
            'lastname',
            'phone',
            'dateInitial',
            'price',
                
        ]

class RenovacionForm(forms.ModelForm):
     class Meta:
        model = Renovacion
        fields = [
            'fechaRenovacion',
            'fechaVencimiento',
        ]