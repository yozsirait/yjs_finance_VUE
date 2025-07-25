<template>
  <div class="card my-4">
    <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
      <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3">
        <h6 class="text-white text-capitalize ps-3">Tabel Kategori & Anggaran</h6>
      </div>
    </div>

    <div class="card-body px-0 pb-2">
      <div v-if="loading" class="text-center py-4">Memuat data...</div>
      <div v-else class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nama</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tipe</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7">Anggaran</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7">Terpakai</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in mergedCategories" :key="category.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ category.name }}</h6>
                  </div>
                </div>
              </td>

              <td>
                <span class="badge badge-sm text-capitalize"
                  :class="category.type === 'pemasukan' ? 'bg-gradient-success' : 'bg-gradient-danger'">
                  {{ category.type }}
                </span>
              </td>

              <td class="text-center">
                {{ category.budget ? 'Rp ' + Number(category.budget).toLocaleString() : '-' }}
              </td>

              <td class="text-center">
                {{ category.used ? 'Rp ' + Number(category.used).toLocaleString() : '-' }}
              </td>
              <td class="align-middle text-center">
                <router-link v-if="category.type === 'pengeluaran'" :to="`/kategori/${category.id}/anggaran`">
                  <button class="btn btn-sm btn-info text-white me-1" @click="viewDetail(category)" title="View Detail">
                    <i class="fas fa-eye"></i>
                  </button>
                </router-link>
                <button class="btn btn-sm btn-primary me-1" @click="editCategory(category)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>

                <button class="btn btn-sm btn-danger" @click="deleteCategory(category)" title="Hapus">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>

            <tr v-if="mergedCategories.length === 0">
              <td colspan="5" class="text-center py-3">Tidak ada data kategori.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "KategoriPage",
  data() {
    return {
      loading: false,
      mergedCategories: [],
    };
  },
  methods: {
    viewDetail(category) {
      this.$router.push({
        name: 'KategoriAnggaran',
        params: { id: category.id },
        query: {
          name: category.name,
          type: category.type
        }
      });
    }
  },
  async mounted() {
    this.loading = true;
    try {
      // Ambil kategori
      const [categoriesRes, budgetsRes] = await Promise.all([
        axios.get("/categories"),
        axios.get("/budgets"),
      ]);

      const categories = categoriesRes.data;
      const budgets = budgetsRes.data.budgets;
      const usages = budgetsRes.data.usages;

      // Gabungkan berdasarkan nama & tipe kategori
      this.mergedCategories = categories.map((cat) => {
        const matchBudget = budgets.find(
          (b) => b.category === cat.name && b.type === cat.type
        );
        const matchUsage = usages.find(
          (u) => u.category === cat.name && u.type === cat.type
        );

        return {
          ...cat,
          budget: matchBudget ? matchBudget.amount : null,
          used: matchUsage ? matchUsage.total : null,
        };
      });
    } catch (error) {
      console.error("Gagal memuat kategori dan anggaran:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
