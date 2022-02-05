from django.contrib import admin
from .models import *
from .views import *
# Register your models here.



class MusicInstrumentAdmin(admin.ModelAdmin):
    list_display = ["file","instrument"]

    def save_model(self, request, obj, form, change):
           super(MusicInstrumentAdmin,self).save_model(request, obj, form, change)
           obj.instrument = getPredictionAdmin(obj.file.path)
           print(obj.file.path)
           print("=================================>")
           obj.save()


admin.site.register(MusicInstrument,MusicInstrumentAdmin)
