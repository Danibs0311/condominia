from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def ping(request):
    return Response({"status": "online", "versao": "1.0.0"})
