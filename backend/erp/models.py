from django.db import models

class Condominio(models.Model):
    nome = models.CharField(max_length=100)
    endereco = models.TextField()
    responsavel = models.CharField(max_length=100)
    cpf_responsavel = models.CharField(max_length=14)

class Unidade(models.Model):
    numero = models.CharField(max_length=10)
    condominio = models.ForeignKey(Condominio, on_delete=models.CASCADE)

class Morador(models.Model):
    nome = models.CharField(max_length=100)
    unidade = models.ForeignKey(Unidade, on_delete=models.CASCADE)

class Fatura(models.Model):
    unidade = models.ForeignKey(Unidade, on_delete=models.CASCADE)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    vencimento = models.DateField()
    pago = models.BooleanField(default=False)

class Informativo(models.Model):
    titulo = models.CharField(max_length=200)
    mensagem = models.TextField()
    condominio = models.ForeignKey(Condominio, on_delete=models.CASCADE)
    criado_em = models.DateTimeField(auto_now_add=True)
