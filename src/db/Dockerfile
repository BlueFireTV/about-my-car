FROM postgres:17.2-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY init.sql /docker-entrypoint-initdb.d/
RUN chown -R appuser:appgroup /docker-entrypoint-initdb.d

USER appuser
