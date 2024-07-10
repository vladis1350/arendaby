from django.db import models


class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    link = models.CharField(max_length=100, default="/")

    class Meta:
        verbose_name = "Пункт меню"
        verbose_name_plural = "Пункты меню"

    def __str__(self):
        return self.name


class VocationIdeas(models.Model):
    title = models.CharField(max_length=100)
    info = models.TextField(null=True, blank=True, verbose_name='Информация')
    image = models.ImageField('Изображение', upload_to='places/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Идея для отпуска"
        verbose_name_plural = "Идеи для отпуска"

    def __str__(self):
        return self.title


class Region(models.Model):
    name = models.CharField(max_length=100, verbose_name="Регион")

    class Meta:
        verbose_name = "Регион"
        verbose_name_plural = "Регионы"

    def __str__(self):
        return self.name


class Idea(models.Model):
    vocation_ideas = models.ForeignKey(VocationIdeas, on_delete=models.CASCADE, verbose_name="Куда поехать",
                                       related_name='v_ideas')
    # region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="region_id", verbose_name="Регион")
    name = models.CharField(max_length=100)
    image = models.ImageField("Фото", upload_to='places/', blank=True)
    description = models.TextField('Описание')

    class Meta:
        verbose_name = "Идея"
        verbose_name_plural = "Идеи"

    def __str__(self):
        return self.name
