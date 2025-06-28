from django.contrib import admin
from .models import Condominio, Unidade, Morador, Fatura, Informativo

admin.site.register([Condominio, Unidade, Morador, Fatura, Informativo])
