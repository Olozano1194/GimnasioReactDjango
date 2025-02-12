# Proyecto de Gestión de Gimnasio

Este es un proyecto web para gestionar un gimnasio, realizado con React, Tailwind Css y Django Rest Framework.

## Requisitos

- Tener instalado Node.js y npm
- Tener instalado Python y pip
- Tener instalado algun gestor de base de datos, el que ustedes deseen, para este ejemplo usaremos Mysql.

## Configuración

1. **Clonar el repositorio**:
    ```bash
        git clone <url_del_repositorio>
        cd nombre_Proyecto
    ```

### Backend (Django Rest Framework)

2. **Instalar dependencias**:
   - Crear un entorno virtual: Para evitar instalar las dependencias en el entorno global, es recomendable crear un entorno virtual
        ```bash
            python -m venv entorno, //entorno es el nombre que usted le quiera dar            
        ```
    - Activar el entorno virtual: 
        ```bash
            .\entorno\Scripts\activate            
        ```
    
    - Instalar dependencias: Usamos el archivo requirements.txt para instalar las dependencias del proyecto
        ```bash
            pip install -r requirements.txt
        ```

3. **Configurar la base de datos**:
    - Crear una base de datos en Mysql, para este caso se crea con el nombre "gimnasioreact"

    - Configurar el archivo settings.py para que se conecte a la base de datos en este caso Mysql

    - Ejecutar las migraciones para crear las tablas en la base de datos
        ```bash
            python manage.py makemigrations
            python manage.py migrate
        ```

4. **Ejecutamos el servidor**:
        ```bash
            python manage.py runserver
        ```

### Frontend (React + Tailwind)

1. **Instalar dependencias**:
    - Navegar al directorio del proyecto frontend
        ```bash
            cd frontend //En este caso el nombre sería gimnasioReact
        ```

    - Instalar dependencias:
        ```bash
            npm install
        ```

2. **Ejecutar el proyecto**:
        ```bash
           npm run dev
        ```


